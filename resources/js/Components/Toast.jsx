
import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';
import { usePage } from '@inertiajs/inertia-react';
import { Transition } from '@headlessui/react';

export default function Toast() {
    const { flash } = usePage().props;
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        if (flash.msg) {
            setShow(true);
        }
    }, [flash]);

    React.useEffect(() => {
        if (show) {
            setTimeout(() => {
                setShow(false);
            }, 3000);
        }
    }, [show]);

    return (
        <Transition
            show={show}
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-300"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <div className="fixed bottom-0 right-3 z-50">
                <div className="bg-green-400 shadow-lg rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-6 w-6 text-gray-900"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="ml-3 pt-0.5">
                            <p className="text-sm leading-5 font-medium text-white">
                                {flash.msg}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                onClick={() => setShow(false)}
                                className="inline-flex text-gray-900 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293
                                        a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>



        </Transition>
    );

}
