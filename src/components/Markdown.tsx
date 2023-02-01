import React from 'react';

import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

type Img = {
    alt: string;
    src: string;
}

export const Markdown: Record<string, unknown> = {
    h1: ({ ...props }) => <TextElement variant="h4" {...props} />,
    h2: ({ ...props }) => <TextElement variant="h5" {...props} />,
    h3: ({ ...props }) => <TextElement variant="subtitle1" {...props} />,
    a: ({ ...props }) => <Link target="_blank"  {...props} />,
    img: ({ ...props }, { alt, src }: Img) => <img style={{ width: '100%' }} src={src} alt={alt} {...props} />,
    p: ({ ...props }) => <TextElement color="grayText" {...props} />,
    hr: ({ ...props }) => <Divider sx={{ my: 2 }} {...props} />,
    ul: ({ ...props }) => <TextElement color="grayText" {...props} />,
    td: ({ ...props }) => <TableCell sx={{ borderBottom: 'none' }}>{props.children}</TableCell>,

}

export const SectionMarkDown = {
    a: ({ ...props }) => <Link target="_blank" sx={{ my: 2 }} {...props} />,
    p: ({ ...props }) => <Typography sx={{ mx: { md: 4 }, lineHeight: 1.75, maxWidth: { md: 600 } }} align="justify" variant="body1" textAlign="center" {...props} />
};

export default Markdown;


const TextElement = ({ ...props }) => {
    return (
        <Container component={Typography} maxWidth={false} sx={{ maxWidth: 800 }} paragraph align="justify"   {...props}>
            {props.children}
        </Container>
    )
}