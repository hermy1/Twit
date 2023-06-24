import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Dropdown from "./Dropdown";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import { useForm, usePage,router, Link } from "@inertiajs/inertia-react";
import ImageViewer from "react-simple-image-viewer";
import Comments from "@/Pages/Twits/Comments";
import Like from "@/Components/Like";


dayjs.extend(relativeTime);
function Twit({ twit }) {
    //use auth
    const { auth } = usePage().props;
    //state
    const [edit, setEdit] = useState(false);

    //image viewer state
    const [currentImage, setCurrentImage] = useState([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

   
    //comments state
    const [showModal, setShowModal] = useState(false);


    //open image viewer
    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    //close image viewer
    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    //form props, methods (update)
    const { data, setData, patch, clearErrors, reset, errors } = useForm({
        message: twit.message,
        images: twit.images,
    });

    //remove an image
    const removeImage = (imgName) => {
        //remove image from state
        setData(
            "images",
            data.images.filter((img) => img !== imgName)
        );
    };

    
    //submit
    const submit = (e) => {
        e.preventDefault();
        patch(route("twits.update", twit.id), {
            onSuccess: () => setEdit(false),
        });

        //TODO: clean upload btn after submit
    };

    return (
        <div className="max-w-2xl mx-auto px-4">
            {/* link */}

            <div className="p-6 flex space-x-2">
                <img
                    className="w-9 h-9 rounded-full"
                    src={`/uploads/avatar/${twit.user.avatar}`}
                    alt={twit.user.name}
                />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link href={`/profile/${twit.user.username}`}>
                                <span className="text-gray-800">
                                    {twit.user.name} 
                                </span>
                            </Link>
                            <small className="ml-2 text-sm text-gray-600">
                                {dayjs(twit.created_at).fromNow()}
                            </small>
                            {twit.created_at !== twit.updated_at && (
                                <small className="text-sm purple-500">
                                    {" "}
                                    &middot; edited
                                </small>
                            )}
                        </div>
                        {
                            //check to see if twit user matches logged in user
                            twit.user.id === auth.user.id && (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button>
                                            {/* <FaEdit className="h-4 w-3 text-rey-500" /> */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <button
                                            className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                            onClick={() => setEdit(true)}
                                        >
                                            Edit
                                        </button>
                                        <Dropdown.Link
                                            as="button"
                                            href={route(
                                                "twits.destroy",
                                                twit.id
                                            )}
                                            method="delete"
                                        >
                                            Delete
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            )
                        }
                    </div>

                    {edit ? (
                        <form onSubmit={submit}>
                            <textarea
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            />

                            <div className="grid grid-cols-3 mb-2 ">
                                {data.images &&
                                    data.images.map((img, index) => {
                                        return (
                                            <div className="mr-4">
                                                <img
                                                    key={index}
                                                    src={`/uploads/images/${img}`}
                                                    className="mt-0"
                                                    width={200}
                                                />
                                                <PrimaryButton
                                                    type="button"
                                                    className="mt-1 bg-blue-500 hover:bg-blue-700"
                                                    onClick={() =>
                                                        removeImage(img)
                                                    }
                                                >
                                                    X
                                                </PrimaryButton>
                                            </div>
                                        );
                                    })}
                            </div>

                            <InputError
                                message={errors.message}
                                className="mt-2"
                            />

                            <div>
                                <PrimaryButton className="mt-3 mr-1">
                                    Save
                                </PrimaryButton>

                                <PrimaryButton
                                    className=" bg-red-500 hover:bg-red-700"
                                    onClick={() => {
                                        setEdit(false);
                                        reset();
                                        clearErrors();
                                    }}
                                >
                                    Cancel
                                </PrimaryButton>
                            </div>
                        </form>
                    ) : (
                        //TODO: Toast for notifications
                        <div className="container w-full">
                            <p className="mt-4 md:break-normal md:break-all text-gray-900">
                                {twit.message}
                            </p>
                            <div className="container grid grid-cols-3 gap-1 mx-auto">
                                {twit.images &&
                                    twit.images.map((image, index) => (
                                        <div className="w-full rounded">
                                            <img
                                                key={index}
                                                src={`/uploads/images/${image}`}
                                                className="mt-4"
                                                width={200}
                                                onClick={() =>
                                                    openImageViewer(index)
                                                }
                                            />
                                        </div>
                                    ))}
                            </div>
                            {isViewerOpen && (
                                <ImageViewer
                                    src={twit.images.map(
                                        (image) =>
                                            `${`/uploads/images/${image}`}`
                                    )}
                                    currentIndex={currentImage}
                                    disableScroll={false}
                                    closeOnClickOutside={true}
                                    onClose={closeImageViewer}
                                    backgroundStyle={{
                                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="px-4 ">
                {/* <span className="text-xs mr-2">0 Likes</span> */}
                {twit.comments.length > 0 ? (
                    <span className="text-xs text-zinc-600 cursor-pointer" onClick={() => setShowModal(true)}>
                        <strong>{twit.comments.length === 1 ? `${twit.comments.length} Comment`: `${twit.comments.filter(element => {
                            if(element.parent_id == null){
                                return true;
                            }
                            // return false;
                        }).length} Comments`}</strong>
                    </span>
                ) : null}
                <hr className="hr mb-1" />
                <Like twitId={twit.id} twitCount={twit.likes} /> 
                <span>Comments</span>
            </div>
            
        </div>
    );
}

export default Twit;
