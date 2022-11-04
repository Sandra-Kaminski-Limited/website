import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import DateFormatter from "../../components/DateFormatter";
import type { ArticleType } from "./ArticleType";

const Summary = ({ content }: ArticleType) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { slug } = useParams();

    let txt = content.fields.body
    if (txt.length >= 75) {
        txt = txt.substring(0, 75) + '...';
    }

    return (
        <Card  >
            <CardHeader
                title={
                    <Link underline="hover" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/about/${content.fields.author.fields.slug}`)} gutterBottom variant="body2">
                        {content.fields.author.fields.name}
                    </Link>}
                subheader={<DateFormatter dateString={content.fields.date} />}
                avatar={<Avatar src={content?.fields.author.fields.image.fields.file.url} alt={content?.fields.author.fields.image.fields.file.title} />} />
            <CardActionArea onClick={() => navigate(`${pathname}/${content.fields.slug}`, { state: { data: slug } })}>
                <CardMedia component="img" sx={{ height: 300 }} src={content?.fields.coverImage.fields.file.url} alt={content.fields.coverImage.fields.title} />
                <CardHeader component={Stack} sx={{ height: 150 }} title={content.fields.title} subheader={txt} />
            </CardActionArea>
        </Card >

    )
}
export default Summary;