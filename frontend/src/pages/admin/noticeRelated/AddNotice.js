import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';

const AddNotice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, response, error } = useSelector(state => state.user);
    const { currentUser } = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [isGeneral, setIsGeneral] = useState(true);
    const adminID = currentUser._id;

    const { sclassesList } = useSelector((state) => state.sclass);

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    // Si isGeneral est true, on n'inclut pas targetClass dans les champs
    const fields = isGeneral 
        ? { title, details, date, adminID }
        : { title, details, date, adminID, targetClass };
    const address = "Notice";

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    // Charger la liste des classes au chargement du composant
    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getAllSclasses(currentUser._id, "Sclass"));
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        if (status === 'added') {
            navigate('/Admin/notices');
            dispatch(underControl());
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);
    
    // Gérer le changement de type de notice (générale ou spécifique à une classe)
    const handleNoticeTypeChange = (event) => {
        const value = event.target.value === 'general';
        setIsGeneral(value);
        if (value) {
            setTargetClass('');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-6">
            <form
                onSubmit={submitHandler}
                className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 md:p-8 max-w-md w-full shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-fadeIn font-poppins"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
                    Add Notice
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            placeholder="Enter notice title..."
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Details</label>
                        <input
                            type="text"
                            placeholder="Enter notice details..."
                            value={details}
                            onChange={(event) => setDetails(event.target.value)}
                            className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Type de notice</label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="general"
                                    checked={isGeneral}
                                    onChange={handleNoticeTypeChange}
                                    className="form-radio h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Générale (toutes les classes)</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="specific"
                                    checked={!isGeneral}
                                    onChange={handleNoticeTypeChange}
                                    className="form-radio h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Spécifique à une classe</span>
                            </label>
                        </div>
                    </div>
                    
                    {!isGeneral && (
                        <div>
                            <label className="block text-gray-700 mb-2">Classe cible</label>
                            <select
                                value={targetClass}
                                onChange={(event) => setTargetClass(event.target.value)}
                                className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                required={!isGeneral}
                            >
                                <option value="">Sélectionner une classe</option>
                                {sclassesList.map((sclass) => (
                                    <option key={sclass._id} value={sclass._id}>
                                        {sclass.sclassName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={loader}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins flex items-center"
                    >
                        {loader ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></div>
                        ) : (
                            'Add'
                        )}
                    </button>
                </div>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddNotice;