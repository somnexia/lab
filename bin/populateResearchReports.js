// populateResearchReports.js
const fs = require('fs');
const path = require('path');
const { ResearchReport, Research, Experiment, ExperimentExpenses, ExperimentResults } = require('./models'); // Подключаем модели
const sequelize = require('./models').sequelize;

async function populateResearchReports() {
  try {
    // Получаем все исследования
    const researches = await Research.findAll();

    for (const research of researches) {
      // Подсчитываем количество экспериментов в исследовании
      const totalExperiments = await Experiment.count({
        where: { research_id: research.id }
      });

      // Объединяем результаты всех экспериментов для aggregate_results
      const reports = await ResearchReport.findAll();
      for (const report of reports) {
        const aggregateData = await generateAggregateData(report.id);
        report.aggregate_results = aggregateData;
        await report.save();
      }

      // Подсчитываем общие расходы на основе ExperimentExpenses
      const totalCost = await ExperimentExpenses.sum('quantity_used', {
        where: { experiment_id: experiments.map(exp => exp.id) }
      });

      // Генерируем выводы и рекомендации (можно использовать другие подходы)
      const conclusions = `Выводы для исследования: ${research.title}`;
      const recommendations = `Рекомендации для исследования: ${research.title}`;

      // Создаем запись в ResearchReports
      await ResearchReport.create({
        research_id: research.id,
        summary: `Отчет по исследованию "${research.title}"`,
        total_experiments: totalExperiments,
        aggregate_results: aggregateResults,
        total_cost: totalCost || 0,
        conclusions: conclusions,
        recommendations: recommendations,
        publication_ready: 0 // по умолчанию не готово к публикации
      });
    }

    console.log('Таблица ResearchReports успешно заполнена данными.');
  } catch (error) {
    console.error('Ошибка при заполнении таблицы ResearchReports:', error);
  } finally {
    await sequelize.close();
  }
}

async function generateAggregateData(reportId) {
  const results = await ExperimentResults.findAll({ where: { research_report_id: reportId } });
  const expenses = await ExperimentExpenses.findAll({ where: { research_report_id: reportId } });

  const aggregateData = {
    results: results.map(result => ({
      item: result.result_item_name,
      type: result.result_item_type,
      quantity: result.quantity,
      unit: result.unit_measure
    })),
    expenses: expenses.map(expense => ({
      item: expense.item_name,
      quantity: expense.quantity_used,
      unit: expense.unit_measure
    }))
  };

  return aggregateData;
}

async function populateResearchReports() {
  // Получаем все отчеты и заполняем агрегированные данные
  const reports = await ResearchReport.findAll();
  for (const report of reports) {
    const aggregateData = await generateAggregateData(report.id);
    report.aggregate_results = aggregateData;
    await report.save();
  }
}

// Запуск функции
populateResearchReports();
