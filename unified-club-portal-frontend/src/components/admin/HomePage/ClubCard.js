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

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    width: 345,
    heigth: 370,
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

    const classes = useStyles();
    const mobileClasses = mobileStyles();

    const isMobile = useMediaQuery({ maxWidth: 400});

    return (
        <div className='card-margin'>
        <a className="card-links" href={'/user/club-profiles/'+ get_title(club.title)}>
        <Card className={isMobile ? mobileClasses.root : classes.root}>
            <CardActionArea>
            <CardMedia
                component="img"
                alt={club.title}
                height="240"
                image={club.profile}
                title="Contemplative Reptile"
            />
            <CardContent className='card-content'>
                <Typography gutterBottom variant="h5" component="h2">
                {club.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                {club.tag_line}
                </Typography>
            </CardContent>
            </CardActionArea>
        </Card>
        </a>
        </div>
    )
}

export default ClubCard
