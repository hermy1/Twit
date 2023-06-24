import React, { useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Twit from "@/Components/Twit";
import InputError from "@/Components/InputError";
import TwitPost from "@/Components/TwitPost";
import Dropdown from "@/Components/Dropdown";

function Show({ twit, auth }) {
    dayjs.extend(relativeTime);
    //replies
    const [reply, setReply] = useState(false);
    const [replyId, setReplyId] = useState();
    const [showReplies, setShowReplies] = useState(false);
    const { data, setData, post, clearErrors, reset, errors } = useForm({
        comment_body: "",
        twit_id: twit.id,
        parent_id: replyId,
    });
// FIXME: this whole componet is a mess, need to refactor
    const replyToComments = (commentId) => {
        setReply(true);
        setReplyId(commentId);
        setData("parent_id", commentId);
    };
    const submitComment = (e) => {
        e.preventDefault();
        post(route("comments.store"), {
            onSuccess: () => {
                reset();
            },
        });
        setReply(false);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${auth.user.name} on Twee-ter`} />
            {/* Show: {twit.id} : {twit.message} */}
            <div className="flex md:flex-row flex-col container mx-auto max-w-7xl mt-10">
                <div className="basis-1/6 max-md:hidden ">
                    <div className="w-[19.875rem] rounded-lg bg-white text-[0.8125rem] leading-5 text-slate-900 ring-slate-700/10 sticky top-0">
                        <div className="flex items-center p-4 pb-0">
                            {/* <img
                                src=""
                                alt=""
                                class="w-14 h-14 mx-auto rounded-full  aspect-square "
                            /> */}
                        </div>
                        <div class="space-y-4 text-center divide-y divide-gray-700">
                            <div class="my-2 space-y-1 pb-8">
                                <p className="text-indigo-500">Back</p>
                                <h2 class=" sm:text-2xl">{auth.user.name}</h2>
                                <p className="text-gray-600 text-center font-light lg:px-8">
                                    {auth.user.description}
                                </p>
                                <p>
                                    Joined{" "}
                                    {dayjs(auth.user.created_at).fromNow()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" basis-4/5">
                    <div className="px-2 sm:px-6 lg:px-6">
                        {/* <Twit key={twit.id} twit={twit} /> */}

                        <section className="bg-white py-8 lg:py-16">
                            {/* <Twit key={twit.id} twit={twit} /> */}
                            <TwitPost key={twit.id} twit={twit} />
                            <div className="max-w-2xl mx-auto px-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 ">
                                        Comments {twit.comments.length}
                                    </h2>
                                </div>
                                <form className="mb-6" onSubmit={submitComment}>
                                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                                        <label
                                            htmlFor="comment"
                                            className="sr-only"
                                        >
                                            Your comment
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows={4}
                                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                                            placeholder="Write a comment..."
                                            required=""
                                            defaultValue={""}
                                            value={data.comment_body}
                                            onChange={(e) =>
                                                setData(
                                                    "comment_body",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="hidden"
                                            name="twit_id"
                                            value={twit.id}
                                            onChange={(e) =>
                                                setData(
                                                    "twit_id",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
                                    >
                                        Post comment
                                    </button>
                                    <InputError
                                        message={errors.comment_body}
                                        className="mt-2"
                                    />
                                </form>
                                {twit.comments.map((comment) => (
                                    <article
                                        key={comment.id}
                                        className={`p-6 mb-6 text-base bg-white rounded-lg ${
                                            comment.parent_id != null
                                                ? ""
                                                : "ml-6 lg:ml-12 text-base"
                                        } `}
                                        // ml-6 lg:ml-12 text-base
                                    >
                                        <footer className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <p className="inline-flex items-center mr-3 text-sm text-gray-900">
                                                    <img
                                                        className="mr-2 w-6 h-6 rounded-full"
                                                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                                        alt="Michael Gough"
                                                    />
                                                    {comment.user.name}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <time
                                                        pubdate=""
                                                        dateTime="2022-02-08"
                                                        title="February 8th, 2022"
                                                    >
                                                        Feb. 8, 2022
                                                    </time>
                                                </p>
                                            </div>

                                            {comment.user_id == auth.user.id ? (
                                                //only one who posted can delete
                                                <div className="flex justify-end">
                                                    <Dropdown>
                                                        <Dropdown.Trigger>
                                                            <button>
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
                                                                onClick={() =>
                                                                    replyToComments(
                                                                        comment.id
                                                                    )
                                                                }
                                                            >
                                                                Reply
                                                            </button>

                                                            <Dropdown.Link
                                                                as="button"
                                                                href={route(
                                                                    "comments.destroy",
                                                                    comment.id
                                                                )}
                                                                method="delete"
                                                            >
                                                                Delete
                                                            </Dropdown.Link>
                                                        </Dropdown.Content>
                                                    </Dropdown>
                                                </div>
                                            ) : (
                                                // anyone can reply to a comment
                                                <div className="flex justify-end">
                                                    <Dropdown>
                                                        <Dropdown.Trigger>
                                                            <button>
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
                                                                onClick={() =>
                                                                    replyToComments(
                                                                        comment.id
                                                                    )
                                                                }
                                                            >
                                                                Reply
                                                            </button>
                                                        </Dropdown.Content>
                                                    </Dropdown>
                                                </div>
                                            )}
                                            {/* Dropdown menu */}
                                            <div
                                                id="dropdownComment1"
                                                className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow"
                                            >
                                                <ul
                                                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                    aria-labelledby="dropdownMenuIconHorizontalButton"
                                                >
                                                    <li>
                                                        <a
                                                            href="#"
                                                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            Edit
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            Remove
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </footer>
                                        <p className="text-gray-500">
                                            {comment.comment_body}
                                        </p>
                                        <div className="flex items-center mt-4 space-x-4">
                                            <button
                                                type="button"
                                                className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    className="mr-1 w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                                Reply
                                            </button>
                                        </div>
                                    </article>
                                ))}
                                {/* <article className="p-6 mb-6 ml-6 lg:ml-12 text-base bg-white rounded-lg">
                                    <footer className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                                <img
                                                    className="mr-2 w-6 h-6 rounded-full"
                                                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                                    alt="Jese Leos"
                                                />
                                                Jese Leos
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <time
                                                    pubdate=""
                                                    dateTime="2022-02-12"
                                                    title="February 12th, 2022"
                                                >
                                                    Feb. 12, 2022
                                                </time>
                                            </p>
                                        </div>
                                        <button
                                            id="dropdownComment2Button"
                                            data-dropdown-toggle="dropdownComment2"
                                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                            type="button"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                            </svg>
                                            <span className="sr-only">
                                                Comment settings
                                            </span>
                                        </button>
                                       
                                        <div
                                            id="dropdownComment2"
                                            className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                        >
                                            <ul
                                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                aria-labelledby="dropdownMenuIconHorizontalButton"
                                            >
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Remove
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Report
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </footer>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Much appreciated! Glad you liked it ☺️
                                    </p>
                                    <div className="flex items-center mt-4 space-x-4">
                                        <button
                                            type="button"
                                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="mr-1 w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                            Reply
                                        </button>
                                    </div>
                                </article> */}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Show;
