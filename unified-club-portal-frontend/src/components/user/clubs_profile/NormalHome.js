import React, {useState, useEffect} from 'react'
import About from "./about/index";
// import Work from "./work/index";
import Header from "./header/index";
import './NormalHome.css'
import Description from './description/index'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import Separator from './separator';
import Calendar from './Calendar/Calendar';
import { SnackbarProvider, useSnackbar } from 'notistack';

const NormalHome = (props) => {


    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => () => {
        // variant could be success, error, warning, info, or default
         enqueueSnackbar(message, { variant });   
        
    };

    const [checked, setchecked] = useState(false);

    const handleChange = () => {

        let formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("title", club.split('-').join(' '));
        if(!checked){
            fetch('http://127.0.0.1:8000/api/club/member_add',{
                method: "POST",
                body: formData
            }).then( data => data.json()).then(
                data => {
                    if(data.success){
                        handleClickVariant('success', data.success)()
                    }else if(data.error){
                        handleClickVariant('error', data.error)()
                    }else{
                        handleClickVariant('error', data)()
                    }
                    
                }
            )
        }else{
            fetch('http://127.0.0.1:8000/api/club/member_delete',{
                method: "POST",
                body: formData
            }).then( data => data.json()).then(
                data => {
                    if(data.success){
                        handleClickVariant('success', data.success)()
                    }else if(data.error){
                        handleClickVariant('error', data.error)()
                    }else{
                        handleClickVariant('error', data)()
                    }
                    
                }
            )
        }
        setTimeout(() => setchecked(!checked), 100);
        
    };

    let {club} = useParams();

    useEffect(() => {
        let formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("title", club.split('-').join(' '));
        fetch('http://127.0.0.1:8000/api/club/is_member',{
                method: "POST",
                body: formData
            }).then(
                data => data.json()
            ).then(
                data => {
                    if(data.user === 'true'){
                        setchecked(true)
                    }else{
                        setchecked(false);
                    }
                    
                    console.log(data.user)
                }
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // useEffect(() => {
    //     let formData = new FormData();
    //     formData.append("token", localStorage.getItem("token"));
    //     formData.append("title", club.split('-').join(' '));
    //     if(checked){
    //         fetch('http://127.0.0.1:8000/api/club/member_add',{
    //             method: "POST",
    //             body: formData
    //         })
    //     }else{
    //         fetch('http://127.0.0.1:8000/api/club/member_delete',{
    //             method: "POST",
    //             body: formData
    //         })
    //     }
    // }, [checked])

    return (
        <div className='home'>

            <div>
                <Header />
            </div>
        
            <div className="body">
            <section id="about">
                <About club={props.club}/>
            </section>
            <section id='description'>
                <Description club={props.club}/>
            </section>
            <section id='member'>
            <Separator />
            <label className="section-title">Register as Member</label>
            <div className='become-member'>
                <FormControlLabel
                    label={
                        checked ? "You are a member" : "Become a member"
                    }
                    control={   
                    <Switch
                        checked={checked ? true: false}
                        onChange={handleChange}
                        name="checked"
                        color="primary"
                    />
                    }
                    
                />
            </div>
            </section>
            <section id='calendar'>
                <Calendar />
            </section>
            </div>
        </div>
    )
}

export default function IntegrationNotistack(props) {
    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={1000}>
        <NormalHome club={props.club}/>
      </SnackbarProvider>
    );
  }
