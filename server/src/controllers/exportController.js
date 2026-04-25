const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');
const { VkPost, VkGroupStats } = require('../models');
const path = require('path');

exports.exportExcel = async (req, res) => {
  try {
    const posts = await VkPost.findAll({ order: [['date', 'DESC']] });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Статистика постов');

    sheet.columns = [
      { header: 'ID', key: 'vkId', width: 15 },
      { header: 'Дата', key: 'date', width: 20 },
      { header: 'Текст', key: 'text', width: 50 },
      { header: 'Лайки', key: 'likes', width: 10 },
      { header: 'Просмотры', key: 'views', width: 10 },
      { header: 'Репосты', key: 'reposts', width: 10 },
      { header: 'Комментарии', key: 'comments', width: 10 },
    ];

    posts.forEach(post => {
      sheet.addRow({
        vkId: post.vkId,
        date: post.date.toLocaleString('ru-RU'),
        text: post.text ? post.text.substring(0, 100) + '...' : '',
        likes: post.likes,
        views: post.views,
        reposts: post.reposts,
        comments: post.comments
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=vk_stats.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при экспорте Excel', error: error.message });
  }
};

exports.exportPdf = async (req, res) => {
  try {
    const posts = await VkPost.findAll({ limit: 20, order: [['date', 'DESC']] });
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    const fontPath = path.join(__dirname, '../../assets/fonts/Roboto-Regular.ttf');
    const fontBoldPath = path.join(__dirname, '../../assets/fonts/Roboto-Bold.ttf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=MediaPuls_Report.pdf');
    doc.pipe(res);

    // Регистрация шрифтов для поддержки кириллицы
    doc.registerFont('Roboto', fontPath);
    doc.registerFont('Roboto-Bold', fontBoldPath);

    // Шапка отчета
    doc.font('Roboto-Bold').fontSize(24).fillColor('#4f46e5').text('MediaPuls', { align: 'left' });
    doc.font('Roboto').fontSize(10).fillColor('#6b7280').text('Аналитический отчет по контенту', { align: 'left' });
    doc.moveDown(2);

    doc.font('Roboto-Bold').fontSize(16).fillColor('#111827').text('Статистика последних публикаций ВК');
    doc.font('Roboto').fontSize(9).fillColor('#9ca3af').text(`Сформировано: ${new Date().toLocaleString('ru-RU')}`);
    doc.moveDown(1.5);

    const table = {
      title: "",
      headers: [
        { label: "Дата", property: 'date', width: 80 },
        { label: "Текст поста", property: 'text', width: 250 },
        { label: "Лайки", property: 'likes', width: 60 },
        { label: "Просмотры", property: 'views', width: 70 }
      ],
      datas: posts.map(p => ({
        date: p.date.toLocaleDateString('ru-RU'),
        text: p.text ? p.text.substring(0, 60).replace(/\n/g, ' ') + '...' : '-',
        likes: p.likes.toString(),
        views: p.views.toString()
      }))
    };

    await doc.table(table, {
      prepareHeader: () => doc.font('Roboto-Bold').fontSize(10).fillColor('#374151'),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font('Roboto').fontSize(9).fillColor('#4b5563');
      },
      padding: 5,
      columnSpacing: 10,
      hideHeader: false,
      minRowHeight: 20
    });

    doc.end();
  } catch (error) {
    console.error('PDF Export Error:', error);
    res.status(500).json({ message: 'Ошибка при экспорте PDF', error: error.message });
  }
};
