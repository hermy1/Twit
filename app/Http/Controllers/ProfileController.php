<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class ProfileController extends Controller
{
     /**
     * Display the user's profile.
     */
    public function show($username){
            
            $user = User::where('username',$username)->first();
            if($user == null){
                // dd('user not found');
                // return Redirect::to('twits')->with(['msg' =>'User not found']);
                return redirect()->route('twits.index')->with('msg','User not found');
            }
            return Inertia::render('Profile/Timeline', [
                'user' => $user->only('id', 'name', 'email', 'avatar', 'description','username','created_at'),
                'twits' => $user->twits()->with(['user:id,name,avatar,username', 'comments:id,comment_body,like_dislike,created_at,user_id,twit_id,parent_id', 'comments.user:id,name,avatar','comments.replies','comments.replies.user','likes'])->latest()->get(),
            ]);
    }
   
     /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {

        $request->user()->fill($request->validated());

        //validate avatar, shouldn't exceed 2048
        $request->validated([

            'avatar' => 'nullable|image|max:2048',
            'description'=> 'nullable|string|max:256',
            // check if username isn't already exisiting
            'username' => 'required|string|max:255|unique:users,username,' . $request->user()->id,

        ]);

        //if username exists 
        

        //if avatar contains image, set name and move to public folder upload.
        $avatar = $request->hasFile(('avatar'));
        if ($avatar) {
            $avatarName = time() . '.' . $request->avatar->getClientOriginalExtension();
            $request->avatar->move(public_path('/uploads/avatar'), $avatarName);
            $request->user()->update(['avatar' => $avatarName]);
        }

          //save description 
            $request->user()->update(['description' => $request->description]);
        //save username
        $request->user()->update(['username' => $request->username]);
              

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current-password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
