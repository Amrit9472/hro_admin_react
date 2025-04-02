import React, { useEffect, useState } from "react";
import {
  creatEmployee,
  getEmployee,
  updateEmployee,
} from "./services/EmployeeService";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const EmployeeCreateComponent = () => {
  const [fullName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [jobProfile, setJobProfile] = useState("");
  const [qualification, setQualification] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [gender, setGender] = useState("");
  const [previousOrganisation, setPreviousOrganisation] = useState("");
  const [dob, setDob] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState("");
  const [refferal, setRefferal] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [file, setFile] = useState(null);
  const [source, setSource] = useState("");
  const [subSource, setSubSource] = useState("");
  const [aadhaarNumber, setAadhaarNumber] =useState("");
  const [experience,setExperience] = useState("");
  const [languages , setLanguages] = useState("");

  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const navigator = useNavigate();

  useEffect(() => {
    if (id) {
      getEmployee(id)
        .then((response) => {
          setFirstName(response.data.fullName);
          setEmail(response.data.email);
          setJobProfile(response.data.jobProfile);
          setQualification(response.data.qualification);
          setMobileNo(response.data.mobileNo);
          setPermanentAddress(response.data.permanentAddress);
          setCurrentAddress(response.data.currentAddress);
          setGender(response.data.gender);
          setPreviousOrganisation(response.data.previousOrganisation);
          setMaritalStatus(response.data.maritalStatus);
          setRefferal(response.data.refferal);
          setSource(response.data.source);
          setSubSource(response.data.subSource);
          setAadhaarNumber(response.data.aadhaarNumber);
          setLanguages(response.data.languages);
          setExperience(response.data.experience);
          setDob(response.data.dob);
          setYear(response.data.year);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  const saveOrUpdateEmployee = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const employee = {
        fullName,
        email,
        jobProfile,
        qualification,
        mobileNo,
        permanentAddress,
        currentAddress,
        gender,
        previousOrganisation,
        dob,
        maritalStatus,
        refferal,
        subSource,
        source,
        aadhaarNumber,
        experience,
        languages,
        year,

      };

      const formData = new FormData();
      formData.append(
        "employee",
        new Blob([JSON.stringify(employee)], { type: "application/json" })
      );
      if (file) {
        formData.append("image", file);
      }

      if (id) {
        updateEmployee(id, formData)
          .then((response) => {
            console.log(response.data);
            navigator("/");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        creatEmployee(formData)
          .then((response) => {
            console.log(response.data);
            navigator("/");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setFullYear(year);
      setDob(updatedDate);
    }
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setYear(newYear);
    if (dob) {
      const updatedDate = new Date(dob);
      updatedDate.setFullYear(newYear);
      setDob(updatedDate);
    }
  };

  const renderYearOptions = () => {
    const years = [];
    const startYear = new Date().getFullYear() - 100;
    const endYear = new Date().getFullYear() + 10;
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    setSubSource(""); // Reset subSource when source changes
  };

  const handleSubSourceChange = (e) => {
    setSubSource(e.target.value);
  };

  const validateForm = () => {
    let isValid = true;
    const errorsCopy = {};

    if (!fullName.trim()) {
      errorsCopy.fullName = "Name is required";
      isValid = false;
    }
    if (!email.trim()) {
      errorsCopy.email = "Email is required";
      isValid = false;
    }
    if (!jobProfile.trim()) {
      errorsCopy.jobProfile = "Job Profile is required";
      isValid = false;
    }
    if (!permanentAddress.trim()) {
      errorsCopy.permanentAddress = "Permanent Address is required";
      isValid = false;
    }
    if (!currentAddress.trim()) {
      errorsCopy.currentAddress = "Current Address is required";
      isValid = false;
    }
    if (!gender.trim()) {
      errorsCopy.gender = "Gender is required";
      isValid = false;
    }
    if (!previousOrganisation.trim()) {
      errorsCopy.previousOrganisation = "Previous Organisation is required";
      isValid = false;
    }
    if (!maritalStatus.trim()) {
      errorsCopy.maritalStatus = "Marital Status is required";
      isValid = false;
    }
    if (!refferal.trim()) {
      errorsCopy.refferal = "Refferal is required";
      isValid = false;
    }
    if (!source.trim()) {
        errorsCopy.source = "Source is required";
        isValid = false;
      }
      if (!subSource.trim()) {
        errorsCopy.subSource = "Sub Source is required";
        isValid = false;
      }
    
    if(!aadhaarNumber.trim()){
        errorsCopy.aadhaarNumber ="Aadhaar Number is required";
        isValid = false;
    }
    if(!languages.trim()){
        errorsCopy.languages = "languages is required";
        isValid = false;
    }
    if(!experience.trim()){
        errorsCopy.experience = "experience is required";
        isValid = false;
    }
    setErrors(errorsCopy);
    return isValid;
  };

  const pageTitle = () => {
    return (
      <h2 className="text-center">{id ? "Update Employee" : "Add Employee"}</h2>
    );
  };
  return (
    <div className="container">
      <br></br>
      <div className="row">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          {/* <h2 className='text-center'>REGISTER FORM</h2> */}
          {pageTitle()}
          <div className="card-body">
            <form>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className={`form-control ${errors.fullName} ?'is-invalid':''}`}
                  value={fullName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  placeholder="Enter Email"
                  className={`form-control ${errors.email} ?'is-invalid':''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Job Profile</label>
                <input
                  type="text"
                  placeholder="job profile is required"
                  className={`form-control ${errors.jobProfile} ?'is-invalid':''}`}
                  value={jobProfile}
                  onChange={(e) => setJobProfile(e.target.value)}
                />
                {errors.jobProfile && (
                  <div className="invalid-feedback">{errors.jobProfile}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  placeholder="Enter qualification"
                  className={`form-control ${errors.qualification} ?'is-invalid':''}`}
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
                {errors.qualification && (
                  <div className="invalid-feedback">{errors.qualification}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Mobile No</label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className={`form-control ${errors.mobileNo} ?'is-invalid':''}`}
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                />
                {errors.mobileNo && (
                  <div className="invalid-feedback">{errors.mobileNo}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Permanent Address</label>
                <input
                  type="text"
                  placeholder="Enter Permanent Address"
                  className={`form-control ${errors.permanentAddress} ?'is-invalid':''}`}
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                />
                {errors.permanentAddress && (
                  <div className="invalid-feedback">
                    {errors.permanentAddress}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Current Address</label>
                <input
                  type="text"
                  placeholder="Enter Current Address"
                  className={`form-control ${errors.currentAddress} ?'is-invalid':''}`}
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                />
                {errors.currentAddress && (
                  <div className="invalid-feedback">
                    {errors.currentAddress}
                  </div>
                )}
              </div>
              {/* <div className='form-group'>
                                <label className='form-label'>Gender</label>
                                <input type='text'
                                    placeholder='Enter Gender'
                                    className={`form-control ${errors.gender} ?'is-invalid':''}`}
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)} />
                                {errors.gender && <div className='invalid-feedback'>{errors.gender}</div>}
                            </div> */}
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className={`form-control ${
                    errors.gender ? "is-invalid" : ""
                  }`}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <div className="invalid-feedback">{errors.gender}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Previous Organisation</label>
                <input
                  type="text"
                  placeholder="Enter Previous Organisation"
                  className={`form-control ${errors.previousOrganisation} ?'is-invalid':''}`}
                  value={previousOrganisation}
                  onChange={(e) => setPreviousOrganisation(e.target.value)}
                />
                {errors.previousOrganisation && (
                  <div className="invalid-feedback">
                    {errors.previousOrganisation}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <select
                    value={year}
                    onChange={handleYearChange}
                    className="form-control"
                  >
                    {renderYearOptions()}
                  </select>
                  <DatePicker
                    selected={dob}
                    onChange={handleDateChange}
                    className="form-control"
                    placeholderText="Enter dob"
                    dateFormat="MM/dd"
                    showMonthDropdown
                    showDayDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Marital Status</label>
                <input
                  type="text"
                  placeholder="Enter Marital status"
                  className={`form-control ${errors.maritalStatus} ?'is-invalid':''}`}
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                />
                {errors.maritalStatus && (
                  <div className="invalid-feedback">{errors.maritalStatus}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Refferal</label>
                <input
                  type="text"
                  placeholder="Enter Refferal"
                  className={`form-control ${errors.refferal} ?'is-invalid':''}`}
                  value={refferal}
                  onChange={(e) => setRefferal(e.target.value)}
                />
                {errors.refferal && (
                  <div className="invalid-feedback">{errors.refferal}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Aadhaar Number No</label>
                <input
                  type="text"
                  placeholder="Enter Aadhar No"
                  className={`form-control ${errors.aadhaarNumber} ?'is-invalid':''}`}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                />
                {errors.aadhaarNumber && (
                  <div className="invalid-feedback">{errors.aadhaarNumber}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Total Experience</label>
                <input
                  type="text"
                  placeholder="Enter Total Experience"
                  className={`form-control ${errors.experience} ?'is-invalid':''}`}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
                {errors.experience && (
                  <div className="invalid-feedback">{errors.experience}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Languages</label>
                <input
                  type="text"
                  placeholder="Enter languages"
                  className={`form-control ${errors.languages} ?'is-invalid':''}`}
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                />
                {errors.languages && (
                  <div className="invalid-feedback">{errors.languages}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Aadhar upload</label>
                <input
                  type="file"
                  id="image"
                  placeholder="select your Aadhar File"
                  className={`form-control ${errors.file ? "is-invalid" : ""}`}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {errors.file && (
                  <div className="invalid-feedback">{errors.file}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <select
                  className={`form-control ${
                    errors.source ? "is-invalid" : ""
                  }`}
                  value={source}
                  onChange={handleSourceChange}
                >
                  <option value="" disabled>
                    Select Source
                  </option>
                  <option value="Vendor">Vendor</option>
                  <option value="Emp Ref">Employee Reference</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Portal">Portal</option>
                  <option value="NGO">NGO</option>
                  <option value="Campus">Campus</option>
                  <option value="Walk In">Walk In</option>
                </select>
                {errors.source && (
                  <div className="invalid-feedback">{errors.source}</div>
                )}

                {source === "Vendor" && (
                  <div className="form-group">
                    <label className="form-label">
                      Sub Source (Name of Vendor)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Vendor Name"
                      className={`form-control ${
                        errors.subSource ? "is-invalid" : ""
                      }`}
                      value={subSource}
                      onChange={handleSubSourceChange}
                    />
                    {errors.subSource && (
                      <div className="invalid-feedback">{errors.subSource}</div>
                    )}
                  </div>
                )}

                {source === "Emp Ref" && (
                  <div className="form-group">
                    <label className="form-label">
                      Sub Source (Employee Code)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Employee Code"
                      className={`form-control ${
                        errors.subSource ? "is-invalid" : ""
                      }`}
                      value={subSource}
                      onChange={handleSubSourceChange}
                    />
                    {errors.subSource && (
                      <div className="invalid-feedback">{errors.subSource}</div>
                    )}
                  </div>
                )}
                {source === "Portal" && (
                  <div className="form-group">
                    <label className="form-label">Sub Source (Portal)</label>
                    <input
                      type="text"
                      placeholder="Enter Employee Code"
                      className={`form-control ${
                        errors.subSource ? "is-invalid" : ""
                      }`}
                      value={subSource}
                      onChange={handleSubSourceChange}
                    />
                    {errors.subSource && (
                      <div className="invalid-feedback">{errors.subSource}</div>
                    )}
                  </div>
                )}
                {source === "Social Media" && (
                  <div className="form-group">
                    <label className="form-label">
                      Sub Source (Social Media)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Employee Code"
                      className={`form-control ${
                        errors.subSource ? "is-invalid" : ""
                      }`}
                      value={subSource}
                      onChange={handleSubSourceChange}
                    />
                    {errors.subSource && (
                      <div className="invalid-feedback">{errors.subSource}</div>
                    )}
                  </div>
                )}
                {source === "NGO" && (
                  <div className="form-group">
                    <label className="form-label">Sub Source (NGO)</label>
                    <input
                      type="text"
                      placeholder="Enter Employee Code"
                      className={`form-control ${
                        errors.subSource ? "is-invalid" : ""
                      }`}
                      value={subSource}
                      onChange={handleSubSourceChange}
                    />
                    {errors.subSource && (
                      <div className="invalid-feedback">{errors.subSource}</div>
                    )}
                  </div>
                )}
                {source === "Campus" && (
                  <div className="form-group">
                    <label className="form-label">Sub Source (Campus)</label>
                    <input
                      type="text"
                      placeholder="Enter Employee Code"
                      className={`form-control ${
                        errors.subSource ? "is-invalid" : ""
                      }`}
                      value={subSource}
                      onChange={handleSubSourceChange}
                    />
                    {errors.subSource && (
                      <div className="invalid-feedback">{errors.subSource}</div>
                    )}
                  </div>
                )}
                {source === "Walk In" && (
                  <div className="form-group">
                    <label className="form-label">Sub Source (Walk In)</label>
                    <input
                      type="text"
                      placeholder="Enter Employee Code"
                      className={`form-control ${
                        errors.subSource ? "is-invalid" : ""
                      }`}
                      value={subSource}
                      onChange={handleSubSourceChange}
                    />
                    {errors.subSource && (
                      <div className="invalid-feedback">{errors.subSource}</div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="btn btn-success"
                onClick={saveOrUpdateEmployee}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCreateComponent;
