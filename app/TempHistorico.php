<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TempHistorico extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'temp_historico';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['temperatura', 'hora'];

}
