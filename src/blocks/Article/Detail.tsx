import React, { useReducer, useState } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import ReactGA from 'react-ga4';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import gfm from 'remark-gfm';

import DateFormatter from "@/components/DateFormatter";
import { Time } from '@/components/DateFormatter';
import LoadingImage from '@/components/LoadingImage';
import Markdown from '@/components/Markdown';
import Trail from '@/components/Trail';
import { createSubmission } from '@/functions';
import type { ArticleType, ContentProps } from '@/types'

const Detail = (props: ContentProps<ArticleType>) => {
    const { contentEntry } = props;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/about/${contentEntry.fields.author.fields.slug}`, { state: { data: 'about' } })
        ReactGA.event({
            category: 'About',
            action: `Read more about ${contentEntry.fields.headline}`,
            label: contentEntry.fields.headline
        });
    }

    return (
        <>
            <Trail current={contentEntry?.fields.headline} />
            {contentEntry &&
                <Stack sx={{ my: 4 }} spacing={2} justifyContent="center" alignItems="center">
                    <Typography sx={{ my: 2, maxWidth: "md" }} variant="h1" align="center" >
                        {contentEntry.fields.headline}
                    </Typography>
                    <Stack
                        sx={{ my: 2 }}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2} >
                        <Typography variant="body1"  >
                            <DateFormatter dateString={contentEntry.fields.date} />
                        </Typography>
                        <FiberManualRecordIcon sx={{ height: 2.5, width: 2.5 }} />
                        <Link underline="hover" sx={{ cursor: 'pointer' }} onClick={() => handleClick()} variant="body1">
                            {contentEntry.fields.author.fields.name}
                        </Link>
                    </Stack>
                    <Box sx={{ maxWidth: 800 }}>
                        <LoadingImage
                            skeletonheight={500}
                            sx={{ width: '100%', height: 'auto', py: 4 }}
                            src={contentEntry?.fields.coverImage.fields.file.url}
                            alt={contentEntry.fields.coverImage.fields.title}
                        />
                        <ReactMarkdown remarkPlugins={[gfm]} components={Markdown}>{contentEntry.fields.body}</ReactMarkdown>
                        <Comments contentEntry={contentEntry} />
                    </Box>
                </Stack>
            }
        </>
    )
}
export default Detail;


type State = {
    name: string;
    comment: string;
    date?: number;
}
type Action = {
    [key: string]: string;
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'name':
            return { ...state, name: action.value };
        case 'comment':
            return { ...state, comment: action.value };

        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

type SingleCommentProps = {
    date: number;
    name: string;
    comment: string;
}

type CommentsProps = {
    data: SingleCommentProps[]
}

const Comments = (props: ContentProps<ArticleType>) => {
    const { contentEntry } = props
    const { type } = useParams();
    const [state, dispatch] = useReducer(reducer, {
        name: '',
        comment: ''
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentsProps>();
    const [loading, setLoading] = useState<boolean>(true);
    const searchText = `${type}-${contentEntry.fields.slug}`

    const handleGet = async () => {
        const q = new URLSearchParams();
        q.append('searchText', searchText);
        const url = `/.netlify/functions/comments?${q.toString()}`;
        const res = await fetch(url)
        const data = await res.json();
        if (res.status === 200) {
            setLoading(false);
            setComments(data)
        }
        return data;
    }
    useQuery([comments, searchText], handleGet)

    const handleSubmit = () => {
        setSubmitting(true);
        const data = {
            name: state.name,
            comment: state.comment,
            id: searchText,
        }
        const url = `/.netlify/functions/comments`;
        createSubmission({ url, data, setSubmitting, setSubmitted });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({ type: name, value: value });
    }

    useQuery([comments, searchText], handleGet, {
        enabled: submitted,
    })


    return (
        <Stack sx={{ mt: 10 }} spacing={2}>
            <Typography variant="h1">Comments {" "} {comments?.data?.length !== undefined && <Chip color="info" label={comments?.data?.length} />}</Typography>
            {!submitted ?
                <Stack alignItems="flex-end" spacing={2}>
                    <TextField onChange={handleChange} label="Name" name="name" fullWidth />
                    <TextField onChange={handleChange} label="Comment" name="comment" multiline rows={4} fullWidth />
                    <LoadingButton
                        disabled={state.name === '' || state.comment === ''}
                        loading={submitting}
                        onClick={handleSubmit}
                        variant="contained"
                        size="large">Post comment...</LoadingButton>
                </Stack>
                :
                <Stack>
                    <Typography>Comment posted successfully</Typography>
                </Stack>
            }
            {loading && <Skeleton variant="rectangular" height={100} />}
            {!loading && comments?.data?.map((item: SingleCommentProps, index: number) =>
                <Stack key={index} >
                    <Stack direction="row" alignItems="center" spacing={2} >
                        <Avatar />
                        <Typography variant="subtitle1">
                            {item.name}
                        </Typography>
                        <Typography sx={{ pt: 0.25 }} >
                            <Time date={item?.date} />
                        </Typography>
                    </Stack>
                    <Container sx={{ mb: 1 }} maxWidth="md">
                        <Typography sx={{ mt: 2 }} variant="body1">
                            {item.comment}
                        </Typography>
                    </Container>
                    <Divider />
                </Stack>
            )}
        </Stack>
    )
}