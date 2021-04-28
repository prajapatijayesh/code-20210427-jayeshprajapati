/**
 * @author prajapatijayesh
 * @date 2021-04-28 11:15:10
 * @description 
 *  - use Stream
 */
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream')
const es = require('event-stream');
const _ = require('lodash');
const used = process.memoryUsage().heapUsed / 1024 / 1024;
const _buff = [];

var getStream = function () {
    console.time('start');
    const stream = fs.createReadStream(path.resolve(__dirname, '../source/input.json'), { encoding: 'utf8' });
    var parser = JSONStream.parse('*');
    return stream.pipe(parser);
};

getStream()
    .pipe(es.mapSync(function (data) {
        // TODO: Add logic
        // convert cm to meter
        const cm_2_meter = (data.HeightCm / 100);
        // BMI formula 
        const BMI = (data.WeightKg / cm_2_meter).toFixed(2);

        data.BMI = `${BMI}kg/m2`;
        if (BMI <= 18.5) {
            data.category = 'Under weight';
            data.health_risk = 'Malnutrition risk';
        }
        if (BMI > 18.5 && BMI <= 24.9) {
            data.category = 'Normal weight';
            data.health_risk = 'Low risk';
        }
        if (BMI >= 25 && BMI <= 29.9) {
            over_weight_count++;
            data.category = 'Over weight';
            data.health_risk = 'Enhanced risk';
        }
        if (BMI >= 30 && BMI <= 34.9) {
            data.category = 'Moderately obese';
            data.health_risk = 'Medium risk';
        }
        if (BMI >= 35 && BMI <= 39.9) {
            data.category = 'Severely obese';
            data.health_risk = 'High risk';
        }
        if (BMI >= 40) {
            data.category = 'Very severely obese';
            data.health_risk = 'Very High risk';
        }
        console.log('calculated data -', data);
        _buff.push(data);
    })).on('end', function (err) {
        // write output to file
        if (!_.isEmpty(_buff)) {
            const file = fs.createWriteStream(path.resolve(__dirname, '../source/output.json'));
            file.write(JSON.stringify(_buff));
            file.end();
        }
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        console.timeEnd('start');
        console.log('data', err);
    });