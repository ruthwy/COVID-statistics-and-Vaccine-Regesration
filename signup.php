<?php

ob_start();
session_start();

if($_SESSION['name']!='oasis')
{

  header('location: ../Main.php');
}
?>


<?php

include('connect.php');


  try{


      if(isset($_POST['signup'])){

        if(empty($_POST['email'])){
          throw new Exception("Email can't be empty!");
        }

          if(empty($_POST['uname'])){
             throw new Exception("Username can't be empty!");
          }

            if(empty($_POST['pass'])){
               throw new Exception("Password can't be empty!");
            }
                

        $result = mysqli_query($con,"insert into admininfo(id,username,password,email) values(5,'$_POST[uname]','$_POST[pass]','$_POST[email]')");
        $success_msg="Signup Successfully!";

  
  }
}
  catch(Exception $e){
    $error_msg =$e->getMessage();
  }

?>

<!DOCTYPE html>
<html lang="en">


<head>
<title>Covid Stats and Vaccine Registration</title>
<meta charset="UTF-8">

  <link rel="stylesheet" type="text/css" href="../css/main.css">


  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" >
   
   
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" >
   
  <link rel="stylesheet" href="styles.css" >
   
   
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

</head>



<body style="background-image: url('https://www.emeraldgrouppublishing.com/sites/default/files/image/covid-cells.jpg');
			background-repeat: no-repeat;
			background-attachment:fixed;
			background-size:cover;">



    </header>
  
  

<center>
<h1><p style="color:white;">Sign Up</p></h1>
<p>    <?php
    if(isset($success_msg)) echo $success_msg;
    if(isset($error_msg)) echo $error_msg;
     ?>
       
     </p>
     <br>
<div class="content" style="background:transparent">

  <div class="row">
   
    <form method="post" class="form-horizontal col-md-6 col-md-offset-3">

      <div class="form-group">
          <label for="input1" class="col-sm-3 control-label"><p style="color:white;">Email</p></label>
          <div class="col-sm-7">
            <input type="text" name="email"  class="form-control" id="input1" placeholder="User's Email" />
          </div>
      </div>

      <div class="form-group">
          <label for="input1" class="col-sm-3 control-label"><p style="color:white;">Username</p></label>
          <div class="col-sm-7">
            <input type="text" name="uname"  class="form-control" id="input1" placeholder="Choose Username" />
          </div>
      </div>

      <div class="form-group">
          <label for="input1" class="col-sm-3 control-label"><p style="color:white;">Password</p></label>
          <div class="col-sm-7">
            <input type="password" name="pass"  class="form-control" id="input1" placeholder="Assign a password" />
          </div>
      </div>

      </div>


      <input type="submit" class="btn btn-primary col-md-2 col-md-offset-6" value="Submit" name="signup" />
    </form>
  </div>
    <br>
 
</div>

</center>

</body>



</html>

