
const Sequelize = require('sequelize');
var sequelize = new Sequelize('deltmbikdq5tmk', 'ifydgixfjxjxlq', 'cbc7cd418801208c4e6eb2177f437b1979a904290c8afb1fe76f56b2ea7335a6', {
    host: 'ec2-50-19-255-190.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query:{ raw: true }
});



var initialize = function () {
    return new Promise( (resolve, reject) => {

        sequelize.sync().then(function(){
            resolve(console.log('connected to database'))
        }).catch(function(){
            reject(console.log('not connected'))
        })
    }
    );
}


var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING, 
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course',{
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, {foreignKey: 'course'});

var getAllStudents = function(){
    let data=null
    return new Promise((resolve,reject)=>{
     sequelize.sync().then(()=>{
        Student.findAll().then((data)=>{
                console.log('data collected successfully')
                resolve(data)
        }).catch((err)=>{
            reject('no results returned')
        })
    })
}
)}

var getTAs = function () {
    let data =null
    return new Promise(function (resolve, reject) {
    reject();
    }
    );
};

var getCourses = function(){
   return new Promise((resolve,reject)=>{
sequelize.sync().then(()=>{
    Course.findAll().then((data)=>{
        resolve(data)
    }).catch((err)=>{
        reject('no results returned')
    })
})
}
)
}

var getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
    sequelize.sync().then(()=>{
        Student.findAll({
            where:{
                studentNum:num
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err)=>{
            reject('no results returned')
        })
    })
    }
    );
};

var getCourseById= function(id){
    console.log(id+'here1')
    return new Promise(function(resolve, reject){

        sequelize.sync().then(()=>{
            Course.findAll({
                where:{
                    courseId:id
                }
            }).then((data)=>{
                resolve(data)
            }).catch((err)=>{
                reject('no results returned')
            })
        })
    }
    )
}

var getStudentsByCourse = function (courseid) {
    return new Promise(function (resolve, reject) {
    sequelize.sync().then(()=>{
        Student.findAll({
            where:{
                course:courseid
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err)=>{
            reject('no results returned')
        })
    })
    reject();
    }
    );
};


var addStudent=function(studentData){
    return new Promise ((resolve,reject)=>{
        studentData.TA = (studentData.TA) ? true : false;

        for (const prop in studentData){
            if(studentData[prop]==''){
                studentData[prop]=null
            }
        };

        Student.create({
            firstName: studentData.firstName, 
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA,
            status: studentData.status
        }).then(()=>{
            resolve('student created successfully')
        }).catch(()=>{
            reject('unable to create student')
        })
    }
    )
};

var addCourse = (courseData)=>{
    return new Promise ((resolve,reject)=>{
        Course.create({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription
        }).then(()=>{
            resolve('Course created successfully')
        }).catch(()=>
        {
            reject('Unable to create course')
        })
    })
}


var updateCourse=(courseData)=>{
    return new Promise ((resolve,reject)=>{
        for (const prop in courseData){
            if(courseData[prop]==''){
                courseData[prop]=null
            }
        };
        Course.update({
            where:{courseId:courseData.courseId}
        }).then(()=>
        {
            resolve('course updated successfully')
        }).catch(()=>{
            reject('unable to update course')
        })
    })
};

var deleteCourseById=(id)=>{
    return new Promise ((resolve,reject)=>{
        Course.destroy({
            where:{courseId: id}
        }).then(()=>
        {
            resolve('course deleted successfully')
        }).catch(()=>{
            reject('unable to delete course')
        })
    })
}

var deleteStudentByNum = (studentNum)=>{
    return new Promise ((resolve,reject)=>{
        sequelize.sync().then(()=>{
            Student.destroy({
                where:{studentNum:studentNum}
            }).then(()=>{
                console.log('student deleted successfully')
                resolve('success')
            }).catch(()=>
            {
                console.log('error deleting the student')
                reject('error while deleting the student')
            })
        })
    })
}

var updateStudent=function(studentData){
    return new Promise ((resolve,reject)=>{
    
        studentData.TA = (studentData.TA) ? true : false;

        for (const prop in studentData){
            if(studentData[prop]==''){
                studentData[prop]=null
            }
        };

        Student.update({
            firstName: studentData.firstName, 
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA,
            status: studentData.status
        },
        {
            where:{
                studentNum:studentData.studentNum
            }
        }).then(()=>{
            resolve('Student Updated successfully')
        }).catch(()=>{
            reject('Unable to update the student')
        }
        )
   
    }
    )
}




module.exports={initialize,
                getAllStudents,
                getTAs,
                getCourses,               
                getStudentByNum,
                getStudentsByCourse,
                addStudent,
                getCourseById,
                addCourse,
                updateStudent,
                updateCourse,
                deleteCourseById,
                deleteStudentByNum}

 