const express=require('express');
const exphbs=require('express-handlebars');
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const app =express();
const passport=require('passport');
const bodyParser=require("body-parser");
const flash=require('connect-flash');
const session=require('express-session');
var appConfig=require('./config/appConfig');
mongoose.Promise=global.Promise;
//connect to mongoose
/*
mongoose.connect(require('./config/dbConfig'),{
    useMongoClient:true
}).then(()=>{
    console.log("mongoDb Connected...");
}).catch((err)=>{
    console.log(err);
});
*/

//Load Routers
const notes=require("./routes/notes");
const users=require('./routes/users')

//passport config
require('./config/passport')(passport);
//handlebars middleware
app.engine("handlebars",exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();
})


app.get('/',(req,res)=>{
    const title="Hello"
    res.render("index",{title:title});
});

app.get('/about',(req,res)=>{
    res.render('about');
});


//Use Routes
app.use('/notes',notes);
app.use('/users',users);

app.listen(appConfig.port,()=>{
    console.log(`The server is running on ${appConfig.port}`);
});