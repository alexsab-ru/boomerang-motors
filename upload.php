<?php

session_start();

if (!empty($_FILES)) {
	$path = __DIR__ . '/uploads/';

	if (uploadFiles('file', $path)) {
		$res = ['answer' => 'Файлы успешно загружены'];
		exit(json_encode($res));
	}else{
		$res = ['answer' => 'error', 'error' => 'Ошибка загрузки файлов'];
		exit(json_encode($res));
	}

}

function uploadFiles($name, $path){
	if(isset($_SESSION['files']) && count($_SESSION['files']) >= 10){
		$res = ['answer' => 'error', 'error' => 'Достигнут лимит загрузки файлов'];
		exit(json_encode($res));
	}

	$ext = strtolower(preg_replace('#.+\.([a-z]+)$#i', '$1', $_FILES[$name]['name']));
	$allow_ext = ['jpg','jpeg','png'];

	if ($_FILES[$name]['size'] > 10485760) {
		$res = ['answer' => 'error', 'error' => 'Ошибка! Максимальный размер файлов - 10 Мб'];
		exit(json_encode($res));
	}

	if ($_FILES[$name]['error']) {
		$res = ['answer' => 'error', 'error' => 'Ошибка! Возможно один из файлов слишком большой'];
		exit(json_encode($res));
	}

	if (!in_array($ext, $allow_ext)) {
		$res = ['answer' => 'error', 'error' => 'Разрешены к загрузке файлы: .jpg, .jpeg, .png'];
		exit(json_encode($res));
	}

	$new_name = sha1(uniqid()) . ".$ext";
	$uploadfile = $path.$new_name;
	
	
	if (move_uploaded_file($_FILES[$name]['tmp_name'], $uploadfile)) { 
		$_SESSION['files'][] = $new_name;
		return true;
	}
	
	return false;
}