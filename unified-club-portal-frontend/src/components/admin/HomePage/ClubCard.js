import React from 'react'
import './ClubCard.css'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { useMediaQuery } from "react-responsive";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    width: 345,
    heigth: 360,
  },
});

const mobileStyles = makeStyles({
    root: {
        width: 290,
    },
});


const ClubCard = ({club}) => {

    const get_title = (title) => {
        // console.log(title);
        return title.split(' ').join('-');
    }

    let history = useHistory();

    const classes = useStyles();
    const mobileClasses = mobileStyles();

    const isMobile = useMediaQuery({ maxWidth: 400});

    const handleDelete = () => {
        let formData = new FormData();
        formData.append('title', club.title);
        fetch('http://localhost:8000/api/club/club_delete',{
            method: "POST",
            body: formData
        }).then(
            history.push('/')
        )
    }

    return (
        <div className='card-margin'>
        
        <Card className={isMobile ? mobileClasses.root : classes.root}>
            <CardActionArea>
            <a className="card-links" href={'/user/club-profiles/'+ get_title(club.title)}>
                <CardMedia
                    component="img"
                    alt={club.title}
                    height="240"
                    image={club.profile}
                    title={club.title}
                />
                <CardContent className='card-content'>
                    <Typography gutterBottom variant="h5" component="h2">
                    {club.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    {club.tag_line}
                    </Typography>
                </CardContent>
            </a>
            </CardActionArea>
            <CardActions>
                <Button 
                // size="small" 
                variant='outlined'
                color="secondary"
                onClick={handleDelete}
                >
                Delete
                </Button>
            </CardActions>
        </Card>
        
        </div>
    )
}

export default ClubCard
