/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Mandeep Kaur Student ID: 148986219 Date: 6/08/2022
*
*  Online (Heroku) Link:  https://intense-harbor-91578.herokuapp.com/
*  github link:
* 

********************************************************************************/ 



var collegedata= require('./modules/collegeData')
var express= require('express')
var multer=require('multer')
var path=require('path')
const exphbs = require('express-handlebars');
var upload = multer();
var app= express()
const Sequelize = require('sequelize');

app.use(upload.array()); 

// Add middleware for static contents
app.use(express.static('views'))
app.use(express.static('modules'))

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

var sequelize = new Sequelize('deltmbikdq5tmk', 'ifydgixfjxjxlq', 'cbc7cd418801208c4e6eb2177f437b1979a904290c8afb1fe76f56b2ea7335a6', {
    host: 'ec2-50-19-255-190.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query:{ raw: true }
});


var HTTP_PORT = process.env.PORT || 8080;


//to be used when loading the form
app.use(express.urlencoded({ extended: true }));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

//adding a helper
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    ,
    
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 2 ){
            throw new Error("Handlebars Helper equal needs 2 parameters");
        }
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
}

    
}));

app.get('/students', (req, res) => {

    if( req.query.course &&  req.query.course !== undefined){
        let courseParas = req.query.course;
        console.log(courseParas);

         collegedata.getStudentsByCourse(courseParas).then(course => {
                res.render('students',{
                    data: course,
                    layout: "main"
                })
                console.log("courses data retrieved")
            }).catch(err => {
                err = {
                message : "no results"}
                res.render("students", {message: "no results"})})
           
        }
        else {
            collegedata.getAllStudents().then(students => {
            // res.send(students)
            res.render("students", {
                data: students,
                layout: "main"});
            }).catch(err => {
                err = {
                message : "no results"}
            // res.send()
            res.render("students", {message: "no results"});
        })
    
}});

// app.get("/tas", (req, res) => {
//         collegedata.getTAs().then(tas => {
//         res.send(tas)
//         }).catch(err => {
//         err = {
//             message : "no results"}
//         res.send()
//     })
// })

app.get("/courses", (req, res) => {
    collegedata.getCourses().then(courses => {
        if (courses.length>0){
            res.render('courses',{
                data: courses,
                layout: "main"
            })
            console.log("Get courses called successfully" )
        }
        else{
            res.render("courses", {message: "no results"})
        }
    })
})



app.get("/student/:studentNum", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    data.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error 
    }).then(data.getCourses)
    .then((data) => {
        viewData.courses = data; // store course data in the "viewData" object as "courses"

        // loop through viewData.courses and once we have found the courseId that matches
        // the student's "course" value, add a "selected" property to the matching 
        // viewData.courses object

        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.courses = []; // set courses to empty if there was an error
    }).then(() => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    });
});


app.get("/course/:courseid",(req,res)=>{
    console.log("getting courses by id ")
    let coursenum=req.params.courseid
    collegedata.getCourseById(coursenum).then(courses =>{
        if(cours.length>0){
            res.render('course',{
            data: courses
        })
            }
            else{
                res.status(404).send("Course Not Found")
            }
     }).catch(err=>
    {
        res.render('courses',{message:err})
            })
    });     


    app.get("/student/delete/:studentNum",(req,res)=>{
        console.log('student delete called');
        collegedata.deleteStudentByNum(req.params.studentNum).then(()=>{
            collegedata.getAllStudents().then((students)=>{
                res.render('students',{
                            data:students})
           
            }).catch(()=>{
                res.status(500).send("Unable to Remove Student / Student not found")
        })
    })})
    


//posting the message after adding the student
app.get("/students/add",(req,res)=>
{
    console.log('student add called')
    collegedata.getCourses().then((courses)=>{
        if(courses.length>0){
            res.render('addStudent',{
                data: courses,
                layout:"main"  }) }
        else{
            res.render('addStudent',{
                data: [],
                layout:"main" })}
    })
});
app.get("/courses/add",(req,res)=>
{
    console.log('course add called')
    // res.sendFile(path.join(__dirname,"./views/addStudent.html"))
    res.render('addCourse',{
        layout:"main"
    })
}) ;

//posting the message after adding the student
app.post("/students/add",(req,res)=>{
    collegedata.addStudent(req.body).then(()=>{
        res.redirect("/students")  
    }
    ).catch(err=>{
        res.send(err)
    })
});


app.post("/courses/add",(req,res)=>{
    console.log('course add called')
    collegedata.addCourse(req.body).then(()=>{
        res.redirect("/courses")  
    }
    ).catch(err=>{
        res.send(err)
    })
})



app.post("/student/update",(req,res)=>{
    console.log("calling student update")
    console.log(JSON.stringify(req.body))
    collegedata.updateStudent(req.body).then(()=>{
        
        res.redirect("/students")
    }).catch(err=>{
        res.send(err)
    })

})



app.post("/course/update",(req,res)=>{
    //calling /course/update
    console.log("calling course update")
    console.log(JSON.stringify(req.body))
    collegedata.updateCourse(req.body).then(()=>{
        
        res.redirect("/courses")
    }).catch(err=>{
        res.send(err)
    })

})


app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname,"./views/home.html"));
    res.render('home', {
        // data: someData,
        layout: "main" // do not use the default Layout (main.hbs)
    });
});

app.get("/home", (req, res) => {
        // res.sendFile(path.join(__dirname,"./views/home.html"));
        res.render('home', {
            // data: someData,
            layout: "main" // do not use the default Layout (main.hbs)
        });
    });
    
app.get("/about", (req, res) => {
        //res.sendFile(path.join(__dirname,"./views/about.html"));
        res.render('about',{
            layout:"main"
        })
    });
    
app.get("/htmlDemo", (req, res) => {
        //res.sendFile(path.join(__dirname,"./views/htmlDemo.html"));
        res.render('htmlDemo',{
            layout:"main"
        })
    });

app.get('*', function(req, res){
        res.send('Page Not Found');
    });    

// setup http server to listen on HTTP_PORT
collegedata.initialize()
.then(app.listen(HTTP_PORT, ()=>{ 
    console.log("server listening on port: " + HTTP_PORT)
}))
.catch(err => {
    console.log("Error: No database")
})


