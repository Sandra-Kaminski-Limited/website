import React from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CardActionArea from "@mui/material/CardActionArea";
// import CardContent from '@mui/material/CardContent';
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation, useParams } from "react-router-dom";

import DateFormatter from "@/components/DateFormatter";
import LoadingImage from '@/components/LoadingImage';
import type { ArticleType, ContentProps } from "@/types";

const Summary = (props: ContentProps<ArticleType>) => {
    const { contentEntry } = props;
    const { pathname } = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    // const [style, setStyle] = useState({});

    // useEffect(() => {
    //     if (pathname === "/blog") {
    //         setStyle({ p: 1.3, height: { sm: 130, xl: 110 } })
    //     }
    //     else {
    //         setStyle({ p: 1.3, height: 110 })
    //     }
    // }, [pathname])

    return (
        <>
            {contentEntry &&
                <>
                    <CardActionArea onClick={() => navigate(`${pathname}/${contentEntry.fields.slug}`, { state: { data: slug } })}>
                        <LoadingImage
                            card="true"
                            src={contentEntry?.fields.coverImage.fields.file.url}
                            alt={contentEntry.fields.coverImage.fields.title}
                        />
                    </CardActionArea>
                    <Typography sx={{ p: 1.5 }} align="center" variant="h6">
                        {contentEntry.fields.headline}
                    </Typography>
                    <Stack sx={{ my: 2 }} spacing={2} justifyContent="center" alignItems="center">
                        <Stack
                            sx={{ my: 2 }}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2} >
                            <Typography color="grayText" variant="body1"  >
                                <DateFormatter dateString={contentEntry.fields.date} />
                            </Typography>
                            <FiberManualRecordIcon sx={{ height: 2.5, width: 2.5, color: "grayText" }} />
                            <Link color="grayText" underline="hover" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/about/${contentEntry.fields.author.fields.slug}`)} variant="body1">
                                {contentEntry.fields.author.fields.name}
                            </Link>
                        </Stack>
                    </Stack>
                </>
            }
        </>
    )
}
export default Summary;