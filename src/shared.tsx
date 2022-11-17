import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const Markdown: Record<string, unknown> = {
    a: ({ ...props }) => <Link target="_blank"  {...props} />,
    img: ({ ...props }) => <CardMedia component="img" loading="lazy" sx={{ width: '100%', my: 6 }} {...props} />,
    p: ({ ...props }) => <Typography sx={{ mx: 4, lineHeight: 1.75 }} paragraph color="grayText" variant="body1" {...props} />,
    hr: ({ ...props }) => <Divider sx={{ my: 2 }} {...props} />,
    div: ({ ...props }) => <Stack justifyContent="center" alignItems="center" direction="row" {...props} />,
}

export const SectionMarkDown: Object = {
    a: ({ ...props }: any) => <Link target="_blank" size="large" sx={{ my: 2 }} variant="outlined" {...props} />,
    p: ({ ...props }: any) => <Typography color="GrayText" sx={{ mx: 4, lineHeight: 1.75, maxWidth: { md: 600 } }} paragraph variant="body1" textAlign="center" {...props} />
};

export type Image = {
    fields: {
        file: {
            url: string;
            title?: string;
        }
        title: string;
        description?: string;
    }
}
export type BlockProps = {
    detail: boolean;
    content: {
        fields: any
    }
}