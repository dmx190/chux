<?php

namespace App\Http\Controllers;

use App\TempHistorico;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class TemperaturaController extends Controller
{

    public  function  __contruct(){
        $this->middleware('auth');
    }

    public function index()
    {
        return view('home');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    public function getTemperatura(Request $request){

        $registro = TempHistorico::all();
        $contador = count($registro);
        $registro = TempHistorico::find($contador);

        return $registro;
    }

    public function ajaxLineChart() {
        $lineChart = [
            'labels' => ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
            'data'  => [65, 59, 80, 81, 56, 55, 40]
        ];

        return response()->json($lineChart);
    }

}
