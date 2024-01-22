import { useCallback, useContext, useEffect, useState } from "react";
import cn from 'classnames';
import "./UserDetails.scss";
import { PeopleContext } from "../../store/PeopleContext";
import { useNavigate, useParams } from "react-router-dom";
import { Person } from "../../types/Person";
import { mergeObjects } from "../../utils/function";
import { Loader } from "../Loader/Loader";

const INITIAL_STATE: Person = {
  id: 0,
  name: '',
  username: '',
  email: '',
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
      lat: '',
      lng: '',
    },
  },
  phone: '',
  website: '',
  company: {
    name: '',
    catchPhrase: '',
    bs: '',
  },
  photo: '/react-project/src/icons/no_img.png',
};

interface Errors {
  errorName: boolean;
  errorUsername: boolean;
  errorEmail: boolean;
}

const ERRORS: Errors = {
  errorName: false,
  errorUsername: false,
  errorEmail: false,
}

function generateID() {
  return Date.now();
}

export const UserDetails = () => {
  const {peopleList, deletePerson, updatePersonData, newForm, setNewForm} = useContext(PeopleContext);
  const [formData, setFormData] = useState<Person>(INITIAL_STATE);
  const [personID, setPersonID] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<Errors>(ERRORS);
  const navigate = useNavigate();
  const {id} = useParams();
 
  //Receiving values from inputs and add to the object.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const formatName = name.split('-');
    console.log(formatName);
    
    switch(formatName[0]) {
      case 'address':
        setFormData(formData => ({
          ...formData,
          address: {
            ...formData.address,
            [formatName[1]]: value,
          }
        }));

        break;
      case 'geo':
        if (isNaN(Number(value))) {
          return;
        }

        setFormData(formData => ({
          ...formData,
          address: {
            ...formData.address,
            geo: {
              ...formData.address.geo,
              [formatName[1]]: value,
            }
          }
        }));

        break;
      
      case 'company':
        setFormData(formData => ({
          ...formData,
          company: {
            ...formData.company,
            [formatName[1]]: value,
          }
        }));

        break;

      default:
        if (formatName[0] === 'name' && value) {
          setIsError(prev => ({...prev, errorName: false}));
        }
        if (formatName[0] === 'username' && value) {
          setIsError(prev => ({...prev, errorUsername: false}));
        }
        if (formatName[0] === 'email' && value) {
          setIsError(prev => ({...prev, errorEmail: false}));
        }

        setFormData(formData => ({
          ...formData,
          [formatName[0]]: value,
        }))
    }
    
  }

  const mergeObjectsCallback = useCallback(mergeObjects, []);
  
  //Add timeout to display a situation when User's data store on other API and upon
  //mount this component will be sent separate request for Data loading. If responce is
  //negative, can be added a separate warning message to User instead of form render. 
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      if (id) {
        const formatID = id.split(':');
        const person = peopleList.find(elem => elem.id === +formatID[1]) || null;
        setPersonID(+formatID[1]);
        
        if (person) {
          setFormData((prevFormData) => mergeObjectsCallback(person, prevFormData));
        }
      }
    }, 500);
  }, [id, peopleList, mergeObjectsCallback])

  //Upload images from the User's computer storage.
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const fileInput = event.target;
    const files = fileInput.files;

    if (files && files.length > 0) {
      const file = files[0];
  
      if (isImage(file)) {
        readFile(file);
      } else {
        alert('Please select a valid image file.');
      }
    } else {
      alert('Please select a file.');
    }
  };

  useEffect(() => {
    return () => {
      setNewForm(false);
    }
  }, [setNewForm])
  
  //Checking input file format
  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };
  
  //Format file to readable format, generate URL and push these data to uploadedImages.
  const readFile = (file: File) => {
    const reader = new FileReader();
  
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const imageUrl = event.target?.result as string | undefined;
      
      if (imageUrl) {
        setFormData(prevData => ({
          ...prevData,
          photo: imageUrl,
        }));
      } else {
        console.error('Failed to read the file.');
      }
    };
  
    reader.readAsDataURL(file);
  };

  //Once image removed, re-write photo url to default image in order to render picture on PeoplePage.
  const handleDeletePhoto = () => {
    setFormData(prevData => {
      return {
        ...prevData,
        photo: '/react-project/src/icons/no_img.png',
      }
    })
  };

  //Fully remove personal data.
  const handleDeleteData = () => {
    const confirmAction = confirm('Are you sure to delete the form? All data will be deleted and can not be resoted.');

    if (confirmAction) {
      deletePerson(personID);
    }

    return;
  }

  //Clear all inputs + reset image to default.
  const clearForm = () => {
    const confirmAction = confirm('Are you sure to clear the form? All data will be cleared and can not be resoted.');

    if (confirmAction) {
      setFormData({...INITIAL_STATE, id: formData.id,});

      return;
    }

    return;
  }

  //Cancel any changes.
  const handleReturn = () => {
    navigate('/people');
  }

  //Before submit, checking if compulsory inputs are filled. If not, warning class will be added to relevant labels.
  const handleFormSubmit = () => {
    if (!formData.name || !formData.username || !formData.email) {
      if (!formData.name) {
        setIsError(prev => ({...prev, errorName: true,}))
      }

      if (!formData.username) {
        setIsError(prev => ({...prev, errorUsername: true,}))
      }

      if (!formData.email) {
        setIsError(prev => ({...prev, errorEmail: true,}))
      }

      alert('Please fill Name, Username, Email in order to submit the form.');
      
      return;
    }

    if (newForm) {
      updatePersonData({...formData, id: generateID()}, 'create');

      return;
    }

    updatePersonData(formData, 'update');
  };

  return (
    <section className="user-page">
      <div className="user-page__container">
      <h2 className="user-page__title">User details</h2>
      <article className={cn('profile', {
        'profile--loading': isLoading,
      })}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="photo">
              <div className="photo__frame">
                <img src={formData.photo} alt="profile image" className="photo__img" />
              </div>
              <ul className="photo__btns">
                <li className="photo__btn">
                  <label className="btn btn__upload" htmlFor="photo-upload">
                    Upload
                    <input type="file" name="photo" accept="image/png" id="photo-upload" onChange={e => handleFileUpload(e)}/>
                  </label>
                </li>
                <li className="photo__btn">
                  <button className="btn btn__delete" onClick={() => handleDeletePhoto()}>Remove</button>
                </li>
              </ul>
            </div>
            <form className="personal-form form">
              <p className="form__title">Personal details</p>
              <span className={cn("form__span", {
                'error-warning': isError.errorName,
              })}>
                <input 
                  type="text" 
                  value={formData.name} 
                  name="name"
                  id="name"
                  onChange={e => handleChange(e)}
                />
                <label htmlFor="name">
                  Name
                </label>
              </span>
              <span className={cn("form__span", {
                'error-warning': isError.errorUsername,
              })}>
                <input 
                  name="username" 
                  type="text" 
                  value={formData.username} 
                  onChange={e => handleChange(e)}
                  id="username"
                />
                <label htmlFor="username">
                  Username
                </label>
              </span>
              <span className={cn("form__span", {
                'error-warning': isError.errorEmail,
              })}>
                <input 
                  className="" 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={e => handleChange(e)}
                  id="email"
                />
                <label htmlFor="email">
                  Email
                </label>
              </span>
              <span className="form__span">
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={e => handleChange(e)}
                  id="phone" 
                />
                <label htmlFor="phone">
                  Phone
                </label>
              </span>
              <span className="form__span">
                <input 
                  type="text" 
                  name="website" 
                  value={formData.website} 
                  onChange={e => handleChange(e)}
                  id="website"
                />
                <label htmlFor="website">
                  Website
                </label>
              </span>
            </form>
            <form className="address-form form" action="">
              <p className="form__title">Address details</p>
              <span className="address-form__street form__span">
                <input 
                  type="text" 
                  name="address-street" 
                  value={formData.address.street} 
                  onChange={e => handleChange(e)}
                  id="address-street"
                />
                <label
                  htmlFor="address-street"
                >
                  Street
                </label>
              </span>
              <span className="address-form__suite form__span">
                <input 
                  type="text" 
                  name="address-suite" 
                  value={formData.address.suite} 
                  onChange={e => handleChange(e)}
                  id="address-suite"
                />
                <label htmlFor="address-suite">
                  Suite
                </label>
              </span>
              <span className="address-form__city form__span">
                <input 
                  type="text" 
                  name="address-city" 
                  value={formData.address.city} 
                  onChange={e => handleChange(e)}
                  id="address-city"
                />
                <label htmlFor="address-city">
                  City
                </label>
              </span>
              <span className="address-form__zipcode form__span">
                <input 
                  type="text" 
                  name="address-zipcode" 
                  value={formData.address.zipcode} 
                  onChange={e => handleChange(e)}
                  id="address-zipcode" 
                />
                <label htmlFor="address-zipcode">
                  Zipcode
                </label>
              </span>
              <div className="form geo">
                <p className="form__title">Geolocation</p>
                <span className="geo__span form__span">
                  <input 
                    type="text" 
                    name="geo-lat" 
                    value={formData.address.geo?.lat} 
                    onChange={e => handleChange(e)}
                    id="geo-lat"
                  />
                  <label className="geo__lat" htmlFor="geo-lat">Lat</label>
                </span>
                <span className="geo__span form__span">
                  <input 
                    type="text" 
                    name="geo-lng" 
                    value={formData.address.geo?.lng} 
                    onChange={e => handleChange(e)}
                    id="geo-lng"
                  />
                  <label className="geo__lng" htmlFor="geo-lng">Lng</label>
                </span>
              </div>
            </form>
            <form className="company-form form" action="">
              <p className="form__title">Company details</p>
              <span className="form__span company-form__name">
                <input 
                  type="text" 
                  name="company-name" 
                  value={formData.company.name} 
                  onChange={e => handleChange(e)}
                  id="company-name"
                />
                <label htmlFor="company-name">Name</label>
              </span>
              <span className="form__span company-form__prase">
                <input 
                  type="text" 
                  name="company-catchPhrase" 
                  value={formData.company.catchPhrase} 
                  onChange={e => handleChange(e)}
                  id="company-catchPhrase"
                />
                <label htmlFor="company-catchPhrase">CatchPhrase</label>
              </span>
              <span className="form__span company-form__bs">
                <input 
                  type="text" 
                  name="company-bs" 
                  value={formData.company.bs} 
                  onChange={e => handleChange(e)}
                  id="company-bs"
                />
                <label htmlFor="company-bs">BS</label>
              </span>
            </form>
            <ul className="profile__btns">
              <li className="profile__btn">
                <button 
                  className="btn btn__upload" 
                  onClick={() => handleReturn()}
                >
                  Cancel
                </button>
              </li>
              <li className="profile__btn">
                <button 
                  className="btn btn__clear" 
                  onClick={() => clearForm()}
                >
                  Clear
                </button>
              </li>
              <li className={cn("profile__btn", {
                  'btn__delete--hiden': newForm,
                })}>
                <button 
                  className="btn btn__delete" 
                  onClick={() => handleDeleteData()}
                >
                  Delete
                </button>
              </li>
              <li className="profile__btn">
                <button 
                  className="btn btn__upload" 
                  onClick={() => handleFormSubmit()}
                >
                  {newForm ? 'Create' : 'Update'}
                </button>
              </li>
            </ul>
          </>
        )}
      </article>
      </div>
    </section>
  );
};
