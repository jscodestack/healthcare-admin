import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
// @material-ui/icons
import Dvr from '@material-ui/icons/Dvr';
import Close from '@material-ui/icons/Close';
import Colorize from '@material-ui/icons/Colorize';
import AccountCircle from '@material-ui/icons/AccountCircle';
// core components
import CustomInput from 'components/CustomInput/CustomInput.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Button from 'components/CustomButtons/Button.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardIcon from '../../components/Card/CardIcon.js';
import CardHeader from 'components/Card/CardHeader.js';
import ReactTableBottomPagination from '../../components/ReactTableBottomPagination/ReactTableBottomPagination.js';

import { cardTitle } from '../../assets/jss/material-dashboard-pro-react.js';

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: '15px',
        marginBottom: '0px',
    },
};

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function PatientsTables() {
    const [data, setData] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [deletePatientId, setDeletePatientId] = useState(null);

    const [newFullNameEn, setNewFullNameEn] = useState('');

    const [newFullName, setNewFullName] = useState('');
    const [newGender, setNewGender] = useState('');
    const [newBirthday, setNewBirthday] = useState('');
    const [newCPRNumber, setNewCPRNumber] = useState('');
    const [newCPRFront, setNewCPRFront] = useState('');
    const [newCPRBack, setNewCPRBack] = useState('');
    const [newInsuranceFront, setNewInsuranceFront] = useState('');
    const [newInsuranceBack, setNewInsuranceBack] = useState('');
    const [newUserId, setUserId] = useState('');
    const [newIsUserMain, setNewIsUserMain] = useState('');
    const [newIsDeleted, setNewIsDeleted] = useState('');

    const classes = useStyles();

    const setPatientParam = (info) => {
        const { full_name, gender, date_of_birth, cpr_number, scanned_cpr_front, scanned_cpr_back, scanned_insurance_front, scanned_insurance_back, user_id, is_user_main, is_deleted } = info;
        setNewFullName(full_name);
        setNewGender(gender);
        setNewBirthday(date_of_birth);
        setNewCPRNumber(cpr_number);
        setNewCPRFront(scanned_cpr_front);
        setNewCPRBack(scanned_cpr_back);
        setNewInsuranceFront(scanned_insurance_front);
        setNewInsuranceBack(scanned_insurance_back);
        setUserId(user_id);
        setNewIsUserMain(is_user_main);
        setNewIsDeleted(is_deleted);
    };

    const makeTableRow = (info) => {
        return {
            ...info,
            actions: (
                <div className="actions-right">
                    <Button
                        justIcon
                        round
                        simple
                        onClick={() => {
                            setPatientParam(info);
                            setDeletePatientId(info.id);
                            setEditModal(true);
                        }}
                        color="warning"
                        className="edit"
                    >
                        <Dvr />
                    </Button>
                    <Button
                        justIcon
                        round
                        simple
                        onClick={() => {
                            setDeletePatientId(info.id);
                            setDeleteModal(true);
                        }}
                        color="danger"
                        className="remove"
                    >
                        <Close />
                    </Button>
                </div>
            ),
        };
    };

    const getPatientResults = () => {
        axios.get('/api/patients/').then((res) => {
            setData(res.data.patients.map((prop) => makeTableRow(prop)));
        });
    };

    useEffect(getPatientResults, []);

    const deltePatients = (deleteId) => {
        axios.delete(`/api/patients/${deleteId}`).then(() => {
            setData(data.filter((prop) => prop.id !== deleteId));
        });
    };

    const addPatients = () => {
        axios
            .post('/api/patients/', {
                full_name: newFullName,
                gender: newGender,
                date_of_birth: newBirthday,
                cpr_number: newCPRNumber,
                scanned_cpr_front: newCPRFront,
                scanned_cpr_back: newCPRBack,
                scanned_insurance_front: newInsuranceFront,
                scanned_insurance_back: newInsuranceBack,
                user_id: newUserId,
                is_user_main: newIsUserMain,
                is_deleted: newIsDeleted,
            })
            .then((res) => {
                setData([...data, makeTableRow(res.data.patient)]);
                setAddModal(false);
            });
    };

    const updatePatient = () => {
        axios
            .patch(`/api/patients/${deletePatientId}`, {
                full_name: newFullName,
                gender: newGender,
                date_of_birth: newBirthday,
                cpr_number: newCPRNumber,
                scanned_cpr_front: newCPRFront,
                scanned_cpr_back: newCPRBack,
                scanned_insurance_front: newInsuranceFront,
                scanned_insurance_back: newInsuranceBack,
                user_id: newUserId,
                is_user_main: newIsUserMain,
                is_deleted: newIsDeleted,
            })
            .then((res) => {
                setData(
                    data.map((prop) =>
                        prop.id === deletePatientId ? makeTableRow(res.data.patient) : prop
                    )
                );
                setEditModal(false);
            });
    };

    return (
        <GridContainer>
            <GridItem xs={12}>
                {/* {moment().format('HH:mm:ss.SSS')} */}
                <Card>
                    <CardHeader color="primary" icon>
                        <CardIcon color="primary">
                            <AccountCircle />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Patients</h4>
                    </CardHeader>
                    <CardBody>
                        <GridContainer justify="flex-end">
                            <GridItem>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        setPatientParam({
                                            full_name: '',
                                            gender: '',
                                            date_of_birth: '',
                                            cpr_number: '',
                                            scanned_cpr_front: '',
                                            scanned_cpr_back: '',
                                            scanned_insurance_front: '',
                                            scanned_insurance_back: '',
                                            user_id: '',
                                            is_user_main: '',
                                            is_deleted: '',
                                        });

                                        setAddModal(true);
                                    }}
                                >
                                    Add Patient
                                </Button>
                            </GridItem>
                        </GridContainer>
                        <ReactTableBottomPagination
                            columns={[
                                {
                                    Header: 'Full Name',
                                    accessor: 'full_name',
                                },
                                {
                                    Header: 'Gender',
                                    accessor: 'gender',
                                },
                                {
                                    Header: 'Birthday',
                                    accessor: 'date_of_birth',
                                },
                                {
                                    Header: 'CPR Number',
                                    accessor: 'cpr_number',
                                },
                                {
                                    Header: 'CPR Front',
                                    accessor: 'scanned_cpr_front',
                                },
                                {
                                    Header: 'CPR Back',
                                    accessor: 'scanned_cpr_back',
                                },
                                {
                                    Header: 'Insurance Front',
                                    accessor: 'scanned_insurance_front',
                                },
                                {
                                    Header: 'Insurance Back',
                                    accessor: 'scanned_insurance_back',
                                },
                                {
                                    Header: 'User ID',
                                    accessor: 'user_id',
                                },
                                {
                                    Header: 'User Main',
                                    accessor: 'is_user_main',
                                },
                                {
                                    Header: 'Deleted',
                                    accessor: 'is_deleted',
                                },
                                {
                                    Header: 'Actions',
                                    accessor: 'actions',
                                },
                            ]}
                            data={data}
                        />
                        <Dialog
                            classes={{
                                root: classes.center + ' ' + classes.modalRoot,
                                paper: classes.modal + ' ' + classes.modalSmall,
                            }}
                            open={deleteModal}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={() => setDeleteModal(false)}
                            aria-describedby="small-modal-slide-description"
                        >
                            <DialogContent
                                id="small-modal-slide-description"
                                className={classes.modalBody + ' ' + classes.modalSmallBody}
                            >
                                <h5>Are you sure you want to delete this patient?</h5>
                            </DialogContent>
                            <DialogActions
                                className={
                                    classes.modalFooter + ' ' + classes.modalFooterCenter
                                }
                            >
                                <Button
                                    onClick={() => setDeleteModal(false)}
                                    color="transparent"
                                    className={classes.modalSmallFooterFirstButton}
                                >
                                    Never Mind
                                </Button>
                                <Button
                                    onClick={() => {
                                        setDeleteModal(false);
                                        deltePatients(deletePatientId);
                                    }}
                                    color="success"
                                    simple
                                    className={
                                        classes.modalSmallFooterFirstButton +
                                        ' ' +
                                        classes.modalSmallFooterSecondButton
                                    }
                                >
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            classes={{
                                root: classes.center + ' ' + classes.modalRoot,
                                paper: classes.modal + ' ' + classes.modalSmall,
                            }}
                            open={addModal}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={() => setDeleteModal(false)}
                            aria-labelledby="add-driver-dialog-title-modal-title"
                            aria-describedby="add-driver-dialog-modal-description"
                        >
                            <DialogTitle
                                id="add-driver-dialog-title-modal-title"
                                disableTypography
                                className={classes.modalHeader}
                            >
                                <h4 className={classes.modalTitle}>Add Patient</h4>
                            </DialogTitle>
                            <DialogContent
                                id="add-driver-dialog-modal-description"
                                className={classes.modalBody + ' ' + classes.modalSmallBody}
                            >
                                <form>
                                    <CustomInput
                                        labelText="Full Name"
                                        id="add_full_name"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newFullName,
                                            onChange: (e) => setNewFullName(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Gender"
                                        id="add_gender"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newGender,
                                            onChange: (e) => setNewGender(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Birthday"
                                        id="add_birthday"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newBirthday,
                                            onChange: (e) => setNewBirthday(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="CPR Number"
                                        id="add_cpr_number"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newCPRNumber,
                                            onChange: (e) => setNewCPRNumber(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="CPR Front"
                                        id="add_cpr_front"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newCPRFront,
                                            onChange: (e) => setNewCPRFront(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="CPR Back"
                                        id="add_cpr_back"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newCPRBack,
                                            onChange: (e) => setNewCPRBack(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Insurance Front"
                                        id="add_insurance_front"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newInsuranceFront,
                                            onChange: (e) => setNewInsuranceFront(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Insurance Back"
                                        id="add_insurance_back"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newInsuranceBack,
                                            onChange: (e) => setNewInsuranceBack(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="User ID"
                                        id="add_user_id"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newUserId,
                                            onChange: (e) => setUserId(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="User Main"
                                        id="add_user_main"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newIsUserMain,
                                            onChange: (e) => setNewIsUserMain(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Deleted"
                                        id="add_deleted"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newIsDeleted,
                                            onChange: (e) => setNewIsDeleted(e.target.value),
                                        }}
                                    />
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setAddModal(false)}>Cancel</Button>
                                <Button onClick={() => addPatients()} color="primary">Add</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            classes={{
                                root: classes.center + ' ' + classes.modalRoot,
                                paper: classes.modal + ' ' + classes.modalSmall,
                            }}
                            open={editModal}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={() => setDeleteModal(false)}
                            aria-labelledby="edit-driver-dialog-title-modal-title"
                            aria-describedby="edit-driver-dialog-modal-description"
                        >
                            <DialogTitle
                                id="edit-driver-dialog-title-modal-title"
                                disableTypography
                                className={classes.modalHeader}
                            >
                                <h4 className={classes.modalTitle}>Edit Patient</h4>
                            </DialogTitle>
                            <DialogContent
                                id="edit-driver-dialog-modal-description"
                                className={classes.modalBody + ' ' + classes.modalSmallBody}
                            >
                                <form>
                                    <CustomInput
                                        labelText="Full Name"
                                        id="add_full_name"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newFullName,
                                            onChange: (e) => setNewFullName(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Gender"
                                        id="add_gender"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newGender,
                                            onChange: (e) => setNewGender(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Birthday"
                                        id="add_birthday"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newBirthday,
                                            onChange: (e) => setNewBirthday(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="CPR Number"
                                        id="add_cpr_number"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newCPRNumber,
                                            onChange: (e) => setNewCPRNumber(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="CPR Front"
                                        id="add_cpr_front"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newCPRFront,
                                            onChange: (e) => setNewCPRFront(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="CPR Back"
                                        id="add_cpr_back"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newCPRBack,
                                            onChange: (e) => setNewCPRBack(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Insurance Front"
                                        id="add_insurance_front"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newCPRNumber,
                                            onChange: (e) => setNewInsuranceFront(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Insurance Back"
                                        id="add_insurance_back"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newInsuranceBack,
                                            onChange: (e) => setNewInsuranceBack(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="User ID"
                                        id="add_user_id"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newUserId,
                                            onChange: (e) => setUserId(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="User Main"
                                        id="add_user_main"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newIsUserMain,
                                            onChange: (e) => setNewIsUserMain(e.target.value),
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Deleted"
                                        id="add_deleted"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: newIsDeleted,
                                            onChange: (e) => setNewIsDeleted(e.target.value),
                                        }}
                                    />
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditModal(false)}>Cancel</Button>
                                <Button onClick={() => updatePatient()} color="primary">
                                    Update
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}