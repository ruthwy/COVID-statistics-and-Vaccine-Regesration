/*<?php
session_start();
if(isset($_POST['login']))
{
	

	try{

		
		if(empty($_POST['username'])){
			throw new Exception("Username is required!");
			
		}
		if(empty($_POST['password'])){
			throw new Exception("Password is required!");
			
		}
		
		include ('connect.php');
		
		
		$r=0;
		$result=mysqli_query($con,"select * from admininfo where username='$_POST[username]' and password='$_POST[password]'");

		$r=mysqli_num_rows($result);

		if($r>0){
			$row = mysqli_fetch_assoc($result);
			if ($row['username'] == $_POST['username'] && $row['password'] == $_POST['password']) {
            	$_SESSION['name']="oasis";
			$_SESSION['username'] = $row['username'];
            
            	$_SESSION['id'] = $row['id'];
			header('location: Home.html');
		        exit();
			
			}
		}

		else{
			throw new Exception("Username,Password or Role is wrong, try again!");
			echo("hello");
			header('location: login.php');
		}
	}

	//end of try block
	catch(Exception $e){
		$error_msg=$e->getMessage();
	}
	//end of try-catch
}

?>

<!DOCTYPE html>
<html>
<head>
	<br><br><br><br><br><br>
	<title>Covid Stats and Vaccine Registration</title>
	<link rel="stylesheet" type="text/css" href="css/main.css">
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" >
	 
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" >
	 
	<link rel="stylesheet" href="styles.css" >
	 
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

</head>

<body style="background-image: url('https://www.emeraldgrouppublishing.com/sites/default/files/image/covid-cells.jpg');
			background-repeat: no-repeat;
			background-attachment:fixed;
			background-size:cover;">
	<center>
<div class="text-center" style="margin-bottom:0">
<header>

  <h1> <p style="color:white;">Log In </p> </h1>

</header>
</div>


<?php
//printing error message
if(isset($error_msg))
{
	echo $error_msg;
}
?>


<!-- <div class="content"> -->
	<div class="row">

		<form method="post" class="form-horizontal col-md-6 col-md-offset-3">
			<div class="form-group">
			    <label for="input1" class="col-sm-3 control-label"><p style="color:white;">Username</p></label>
			    <div class="col-sm-7">
			      <input type="text" name="username"  class="form-control" id="input1" placeholder="your username" />
			    </div>
			</div>

			<div class="form-group">
			    <label for="input1" class="col-sm-3 control-label"><p style="color:white;">Password</p></label>
			    <div class="col-sm-7">
			      <input type="password" name="password"  class="form-control" id="input1" placeholder="your password" />
			    </div>
			</div>



			<input type="submit" class="btn btn-primary col-md-3 col-md-offset-5" value="Login" name="login" />
		</form>
	</div>
<!-- </div> -->



<br><br>
<!--<p>hello</p><br>
<p>hello</p><br>
<p>hello</p><br>
<p>hello</p><br>
<p>hello</p><br>
<p>hello</p><br>
<p>hello</p><br><p>hello</p><br><p>hello</p><br><p>hello</p><br><p>hello</p><br><p>hello</p><br><p>hello</p><br>-->
</center>
</body>
</html>
