/**
 * @author prajapatijayesh
 * @date 2021-04-28 11:15:10
 * @description 
 *  - require() the input file
 */

const fs = require('fs');
const path = require('path');
const { PerformanceObserver, performance } = require('perf_hooks');
const _ = require('lodash');

const application = () => {
    // 
    const obs = new PerformanceObserver((items) => {
        console.info(items.getEntries()[0].name, ':', items.getEntries()[0].duration);
        performance.clearMarks();
    });
    obs.observe({ entryTypes: ['measure'] });
    performance.mark('Start');
    buff = require('../source/input.json');
    process_data(buff);
}

function process_data(buff) {
    let over_weight_count = 0;
    const _buff = buff;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    for (const x in _buff) {
        const data = _buff[x];
        // convert cm to meter
        const cm_2_meter = (data.HeightCm / 100);
        // BMI formula 
        const BMI = (data.WeightKg / cm_2_meter).toFixed(2);

        // !fix: we can convert this logic to util lib function
        _buff[x].BMI = `${BMI}kg/m2`;
        if (BMI <= 18.5) {
            _buff[x].category = 'Under weight';
            _buff[x].health_risk = 'Malnutrition risk';
        }
        if (BMI > 18.5 && BMI <= 24.9) {
            _buff[x].category = 'Normal weight';
            _buff[x].health_risk = 'Low risk';
        }
        if (BMI >= 25 && BMI <= 29.9) {
            over_weight_count++;
            _buff[x].category = 'Over weight';
            _buff[x].health_risk = 'Enhanced risk';
        }
        if (BMI >= 30 && BMI <= 34.9) {
            _buff[x].category = 'Moderately obese';
            _buff[x].health_risk = 'Medium risk';
        }
        if (BMI >= 35 && BMI <= 39.9) {
            _buff[x].category = 'Severely obese';
            _buff[x].health_risk = 'High risk';
        }
        if (BMI >= 40) {
            _buff[x].category = 'Very severely obese';
            _buff[x].health_risk = 'Very High risk';
        }
        console.log('calculated data -', data);
    }
    // !fix: we can convert this logic to util lib function
    // write output to file
    if (!_.isEmpty(buff)) {
        const file = fs.createWriteStream(path.resolve(__dirname, '../source/output.json'));
        file.write(JSON.stringify(_buff));
        file.end();
    }
    performance.mark('End');
    performance.measure('PerformanceTime', 'Start', 'End');

    console.log(`over_weight_count: ${over_weight_count}`);
    console.log(`The script uses approximately: ${Math.round(used * 100) / 100} MB`);
    console.log('count:', _.size(_buff));

}

application();