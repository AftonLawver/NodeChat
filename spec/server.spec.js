const request = require('request');

function myFunction(number, number2) {
    return number*number2;
}

describe('calc', () => {
    it('should multiply two numbers to get the answer', () => {
        expect(myFunction(2,6)).toBe(12);
    })
})

describe('get messages', () => {
    it('should return a list thats not empty', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThan(0);
            done();
        })
    })

    it('should return 200 Ok', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        })
    })
})

describe('get messages from user', () => {
    it('should return 200 Ok', (done) => {
        request.get('http://localhost:3000/messages/tim', (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        })
    })
    it('name should be tim', (done) => {
        request.get('http://localhost:3000/messages/tim', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('tim');
            done();
        })
    })
})


