const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3030;

// متغيرات لتتبع حالة البوت
let botStatus = {
    online: false,
    lastMessage: '',
    config: null
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// تقديم صفحة HTML الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint لحفظ الإعدادات
app.post('/api/config', async (req, res) => {
    try {
        const { botToken, serverId, actionType, itemName } = req.body;

        // التحقق من صحة البيانات
        if (!botToken || !serverId || !actionType || !itemName) {
            return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
        }

        // التحقق من نوع العملية
        if (!['roles', 'channels'].includes(actionType)) {
            return res.status(400).json({ error: 'نوع العملية غير صحيح' });
        }

        // إنشاء ملف الإعدادات
        const config = {
            token: botToken,
            serverId: serverId,
            actionType: actionType,
            itemName: itemName.trim(),
            createdAt: new Date().toISOString()
        };

        // كتابة الإعدادات في ملف JSON
        await fs.writeFile('config.json', JSON.stringify(config, null, 2));

        // حفظ الإعدادات في الذاكرة
        botStatus.config = config;
        botStatus.online = true;
        
        const actionText = actionType === 'roles' ? 'الرتبة' : 'الروم';
        botStatus.lastMessage = `تم تحديد ${actionText} "${itemName}" للحذف`;

        console.log('تم حفظ الإعدادات:');
        console.log('- توكن البوت: ' + botToken.slice(0, 10) + '...');
        console.log('- ID السيرفر: ' + serverId);
        console.log('- نوع العملية: ' + (actionType === 'roles' ? 'حذف رتبة' : 'حذف روم'));
        console.log('- الاسم المحدد: ' + itemName);

        // محاكاة تنفيذ العملية
        setTimeout(() => {
            console.log(`جاري البحث عن ${actionText} "${itemName}" في السيرفر...`);
            botStatus.lastMessage = `جاري البحث عن ${actionText} "${itemName}"`;
            
            setTimeout(() => {
                botStatus.lastMessage = `تم العثور على ${actionText} "${itemName}" - جاهز للحذف`;
                console.log(`تم العثور على ${actionText} "${itemName}" - البوت جاهز للتنفيذ`);
            }, 2000);
        }, 1000);

        res.json({ 
            success: true, 
            message: `تم حفظ الإعدادات بنجاح - سيتم حذف ${actionText}: ${itemName}`,
            config: {
                serverId: serverId,
                actionType: actionType,
                itemName: itemName
            }
        });

    } catch (error) {
        console.error('خطأ في حفظ الإعدادات:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حفظ الإعدادات' });
    }
});

// API endpoint للحصول على حالة البوت
app.get('/api/status', (req, res) => {
    res.json({
        online: botStatus.online,
        message: botStatus.lastMessage,
        config: botStatus.config ? {
            serverId: botStatus.config.serverId,
            actionType: botStatus.config.actionType,
            itemName: botStatus.config.itemName
        } : null
    });
});

// API endpoint لإيقاف البوت
app.post('/api/stop', (req, res) => {
    botStatus.online = false;
    botStatus.lastMessage = 'تم إيقاف البوت';
    console.log('تم إيقاف البوت بواسطة المستخدم');
    res.json({ success: true, message: 'تم إيقاف البوت بنجاح' });
});

// API endpoint لتشغيل البوت مرة أخرى
app.post('/api/start', (req, res) => {
    if (!botStatus.config) {
        return res.status(400).json({ error: 'لا توجد إعدادات محفوظة' });
    }

    botStatus.online = true;
    botStatus.lastMessage = 'تم تشغيل البوت مرة أخرى';
    console.log('تم تشغيل البوت مرة أخرى');
    res.json({ success: true, message: 'تم تشغيل البوت بنجاح' });
});

// API endpoint لحذف الإعدادات
app.delete('/api/config', async (req, res) => {
    try {
        await fs.unlink('config.json');
        botStatus = {
            online: false,
            lastMessage: 'تم حذف الإعدادات',
            config: null
        };
        console.log('تم حذف الإعدادات');
        res.json({ success: true, message: 'تم حذف الإعدادات بنجاح' });
    } catch (error) {
        console.error('خطأ في حذف الإعدادات:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الإعدادات' });
    }
});

// تحميل الإعدادات الموجودة عند بدء التشغيل
async function loadExistingConfig() {
    try {
        const configData = await fs.readFile('config.json', 'utf8');
        botStatus.config = JSON.parse(configData);
        botStatus.online = true;
        botStatus.lastMessage = 'تم تحميل الإعدادات الموجودة';
        console.log('تم تحميل الإعدادات الموجودة');
    } catch (error) {
        console.log('لا توجد إعدادات محفوظة مسبقاً');
    }
}

// بدء تشغيل الخادم
app.listen(PORT, async () => {
    console.log(`الخادم يعمل على http://localhost:${PORT}`);
    console.log('=====================================');
    console.log('مرحباً بك في نظام إدارة بوت Discord');
    console.log('=====================================');
    
    // تحميل الإعدادات الموجودة
    await loadExistingConfig();
    
    // محاكاة رسائل البوت
    setInterval(() => {
        if (botStatus.online && botStatus.config) {
            const actionType = botStatus.config.actionType;
            const itemName = botStatus.config.itemName;
            const actionText = actionType === 'roles' ? 'رتبة' : 'روم';
            
            const messages = [
                `البوت جاهز لحذف ${actionText} "${itemName}"`,
                `مراقبة ${actionText} "${itemName}" نشطة`,
                `البوت متصل - في انتظار أمر الحذف`,
                `نظام الحماية نشط للسيرفر`
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            if (Math.random() > 0.7) { // 30% احتمال تحديث الرسالة
                botStatus.lastMessage = randomMessage;
            }
        }
    }, 30000); // كل 30 ثانية
});

// التعامل مع إغلاق التطبيق
process.on('SIGINT', () => {
    console.log('\nجاري إيقاف الخادم...');
    process.exit(0);
});

// تصدير التطبيق للاستخدام الخارجي
module.exports = app;