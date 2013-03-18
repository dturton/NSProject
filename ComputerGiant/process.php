<?php

	session_start();

	$ns_rest_url = '';
	$ns_account = '';
	$ns_email = '';
	$ns_password = '';

	function stripslashes_deep($value)
	{
	  $value = is_array($value) ?
	  array_map('stripslashes_deep', $value) :
	  stripslashes($value);
	  return $value;
	}

	if (get_magic_quotes_gpc())
	{
	  $unescaped_post_data = stripslashes_deep($_POST);
	}
	else
	{
	  $unescaped_post_data = $_POST;
	}

	$form_data = json_decode($unescaped_post_data['data_json']);

	$page_id = $_POST['page_id'];
	$page_url = $_POST['page_url'];
	$variant = $_POST['variant'];

  //Netsuite
  $data_string = json_encode(array(
  "process" => "addLead",
  "isperson"=> "T",
  "prog"=> $form_data->prog[0],
  "firstname"=> $form_data->firstname[0],
  "lastname"=> $form_data->lastname[0],
  "email"=> $form_data->custentity142[0],
  "parents_email"=> $form_data->email[0],
  "phonenumber"=> $form_data->custentity143[0],
  "phone"=> $form_data->phone[0],
  "category"=> $form_data->category[0],
  "comments"=> $form_data->comments[0]
  ));

  $ch = curl_init();

  curl_setopt($ch, CURLOPT_URL, $ns_rest_url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: NLAuth nlauth_account=$ns_account, nlauth_email=$ns_email, nlauth_signature=$ns_password, nlauth_role=3", "Content-Type: application/json", "User-Agent-x: SuiteScript-Call"));
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);

  $results = curl_exec($ch);
  curl_close($ch);
  $json = json_decode($results, true);


  $isSuccess = $json['result'];
  echo $isSuccess;
  echo var_dump($json);

?>