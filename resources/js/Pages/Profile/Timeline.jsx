import ProfileCover from '@/Components/ProfileCover';
import Connections from '@/Components/Socials/Connections';
import Twit from '@/Components/Twit';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/inertia-react';

function Timeline({auth, user, twits}) {
  return (

    <AuthenticatedLayout
    auth={auth}
    // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight"></h2>}
>
    <Head title="Timeline" />
    <div className="container mx-auto max-w-7xl mt-10">
    <div className="bg-gray-100">
    

  <div className="container mx-auto my-5 p-5">
    <div className="no-wrap md:-mx-2 md:flex">
   
<div className="md:mx-2 basis-1/3">


<div className="bg-white rounded-2xl ">
  <img
    alt="profil"
    src={`/uploads/cover.jpg`} 
    className="w-full mb-4 rounded-t-lg h-28"
  />
  <div className="flex flex-col items-center justify-center p-4 -mt-16">
    <a href="#" className="relative block">
      <img
        alt="profil"
        src={`/uploads/avatar/${user.avatar}`} 
        className="mx-auto object-cover rounded-full h-16 w-16  border-2 border-white"
      />
    </a>
    <p className="mt-2 text-xl  text-gray-800">
      Charlie
    </p>
    <p className="mb-4 text-xs text-gray-400">Nantes</p>
    <p className="p-2 px-4 text-xs text-white bg-purple-500 rounded-full">
      Active
    </p>
    <div className="w-full p-2 mt-4 rounded-lg">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p className="flex flex-col">
          Articles
          <span className="font-bold text-black">34</span>
        </p>
        <p className="flex flex-col">
          Followers
          <span className="font-bold text-black">455</span>
        </p>
        <p className="flex flex-col">
          Rating
          <span className="font-bold text-black">9.3</span>
        </p>
      </div>
    </div>
  </div>
</div>

  
      <div className="my-4"></div>
        <Connections />
      </div>

 
      <div className="mx-2 basis-3/4">
        {/* profile cover here */}
        <ProfileCover user={user} />
        <div className="my-4"></div>

        <div className="">
        {/* <div className="rounded bg-white p-10 shadow-sm"> */}
        {twits.map((twit) => (
            <Twit key={twit.id} twit={twit} />
             ))}
        {/* </div> */}
        </div>
      </div>
    </div>
  </div>
</div>
</div>


    </AuthenticatedLayout>
  )
}

export default Timeline
