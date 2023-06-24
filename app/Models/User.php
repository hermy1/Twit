<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar',
        'description'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    // defining a relationship betwen user and twit..
    public function twits() {
        return $this->hasMany(Twit::class);
    }
    
    // defining a relationship betwen user and comment..
    public function comments() {
        return $this->hasMany(Comment::class);
    }

    // defining a relationship betwen user and like..
    public function likes() {
        return $this->hasMany(Like::class);
    }
    //get the count of twits by a user
    public function getTwitsCountAttribute(){
        return $this->twits()->count();
        //TODOFix me: this is not working
    }


}
