app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const client = new line.Client(config);

        // ตรวจสอบว่า replyToken มีอยู่หรือไม่
        if (!event.replyToken || event.replyToken.length === 0) {
          console.log('Invalid replyToken. Skipping this event.');
          continue;
        }

        let replyMessage = {
          type: 'text',
          text: 'ขออภัยค่ะ ระบบไม่สามารถดำเนินการได้ในขณะนี้',
        };

        try {
          if (event.message.text === 'สวัสดี') {
            replyMessage.text = 'สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?';
          } else if (event.message.text === 'ช่วยเหลือ') {
            replyMessage.text = 'คุณสามารถพิมพ์คำว่า "ข้อมูล" เพื่อดูรายละเอียดเพิ่มเติมค่ะ';
          } else if (event.message.text === 'ข้อมูล') {
            replyMessage.text = 'ข้อมูลของเราคือ ...';
          } else {
            replyMessage.text = `คุณพิมพ์ว่า: ${event.message.text}`;
          }

          await client.replyMessage(event.replyToken, replyMessage);
          console.log('Replied with message:', replyMessage);
        } catch (error) {
          console.error('Error occurred while processing message:', error.message);
          console.error('Stack trace:', error.stack);

          await client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ขออภัยค่ะ ระบบยังไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลังค่ะ',
          });
        }
      }
    }

    res.sendStatus(200); // ตอบกลับ HTTP 200
  } catch (error) {
    console.error('Critical error occurred:', error.message);
    console.error('Stack trace:', error.stack);
    res.sendStatus(500); // ตอบกลับ HTTP 500
  }
});
