<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('inicio',[
    'as'    => 'home',
    'middleware' => 'auth',
    'uses'  => 'HomeController@index'
]);


// Authentication routes...
Route::get('/', [
    'as'    => 'login',
    'uses'  => 'Auth\AuthController@getLogin'
]);

Route::post('/', [
    'as'    => 'login',
    'uses'  => 'Auth\AuthController@postLogin'
]);

Route::get('logout', [
    'as'    => 'logout',
    'uses'  => 'Auth\AuthController@getLogout'
]);

// Registration routes...
Route::get('registro', [
    'as'    => 'register',
    'uses'  => 'Auth\AuthController@getRegister'
]);

Route::post('registro', [
    'as'    => 'register',
    'uses'  => 'Auth\AuthController@postRegister'
]);

// Password reset link request routes...
Route::get('password/email', 'Auth\PasswordController@getEmail');
Route::post('password/email', 'Auth\PasswordController@postEmail');

// Password reset routes...
Route::get('password/reset/{token}', 'Auth\PasswordController@getReset');
Route::post('password/reset', 'Auth\PasswordController@postReset');

// Ajax Temperatura

Route::get('ajax/temperatura/load', [
    'uses'  => 'TemperaturaController@getTemperatura'
]);

Route::get('/ajax/charity/line-chart', [
    'uses'      => 'TemperaturaController@ajaxLineChart'
]);