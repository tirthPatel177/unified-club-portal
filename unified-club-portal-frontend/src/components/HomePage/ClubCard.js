import React from 'react'
import './ClubCard.css'
import profile from './../../Resources/club-profile.jpg'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});


const ClubCard = ({club}) => {

    const get_title = (title) => {
        console.log(title);
        return title.split(' ').join('-');
    }

    const classes = useStyles();

    return (
        <Card className={classes.root} >
            <CardActionArea>
            <CardMedia
                component="img"
                alt={club.title}
                height="240"
                image={club.profile}
                title="Contemplative Reptile"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                {club.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                across all continents except Antarctica
                </Typography>
            </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ClubCard
