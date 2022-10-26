var test = {
    server    : 'localhost',
    user    : 'local',
    password: 'local',
    database: 'MicroDB'
};

var prod = {
    server    : '<ENTER DB URL>',
    user    : '<ENTER USER>',
    password: '<ENTER PASSWORD>',
    database: 'MicroDB'
};

if(process.env.NODE_ENV === 'prod'){
    module.exports= `mongodb://${prod.user}:${prod.password}@${prod.server}/${prod.database}`;
  } else {
    module.exports= `mongodb://${test.user}:${test.password}@${test.server}/${test.database}`;
}