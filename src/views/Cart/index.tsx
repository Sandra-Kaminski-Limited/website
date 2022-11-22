import { useEffect, useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import RemoveIcon from '@mui/icons-material/Remove';
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';

import CountryDropdown, { CurrencyExchange, shippingCosts, currencyTypes } from '@/components/PaymentCalc';
import type { Image } from '@/shared';
import { useCartContext } from "@/views/Cart/cartProvider";

type Items = {
    inStock: boolean;
    slug: string;
    id: string;
    name: string;
    price: number;
    amount: number[];
    image: Image;
    nzShippingOnly: boolean;
}

type OrderItems = {
    id: string;
    amount: number[];
}

type Prices = {
    shipping: any;
    total: any;
}

const Cart = () => {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState<boolean>(false);
    const [country, setCountry] = useState<string>("");
    const [nzOnly, setNzOnly] = useState<boolean>(false);
    const { cart, clear, decrease, increase, remove } = useCartContext();
    const shippingCost = shippingCosts(country);
    const cartQuantity = cart.map((item: Items) => item.amount.length).reduce((a: number, b: number) => a + b, 0);
    const shippingTotal = shippingCost * cartQuantity;
    const currency = currencyTypes(country).toLowerCase();

    const [amount, setAmount] = useState<Prices>({
        shipping: 0,
        total: 0
    });

    let shipping;
    if (country === "CL") {
        shipping = amount.shipping.toFixed(0)
    }
    else {
        shipping = amount.shipping.toFixed(0) * 100
    }

    const data = {
        country: country,
        currency: currency,
        shipping: parseInt(shipping),
        orderItems: cart?.map((item: OrderItems) => {
            return {
                productId: item.id,
                quantity: item.amount.length
            }
        })
    }

    const handlePurchase = async () => {
        setProcessing(true)
        const resp = await fetch(`/.netlify/functions/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (resp.ok) {
            const { url } = await resp.json();
            window.location.replace(url);
        }
        else {
            setProcessing(false);
        }
    }

    useEffect(() => {
        if (cart && cart.map((item: Items) => item.nzShippingOnly).includes(true)) {
            setCountry("NZ");
            setNzOnly(true);
        }
        else {
            setCountry("");
            setNzOnly(false);
        }
    }, [cart])

    return (
        <Box sx={{ my: 4 }}>
            {cart && cart.length === 0 ?
                <Stack sx={{ mt: 10 }} justifyContent="space-between" alignItems="center" spacing={2} >
                    <ProductionQuantityLimitsIcon sx={{ fontSize: 100 }} />
                    <Typography variant="h3" align="center" gutterBottom>Shopping cart</Typography>
                    <Typography gutterBottom color="grayText" variant="h5" >You have nothing in your shopping cart.</Typography>
                    <Button variant="outlined" onClick={() => navigate("/shop")} >
                        Shop now
                    </Button>
                </Stack >
                :
                <Grid alignItems="stretch" spacing={1} container >
                    <Grid xs={12} md={8} >
                        <Card sx={{ p: 2, minHeight: 250 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                <Typography variant="h4" >Shopping cart</Typography>
                                <Button endIcon={<CloseIcon />} onClick={clear}>Clear cart</Button>
                            </Stack>
                            <Stack sx={{ mt: 4 }} >
                                {cart.map((item: Items, index: number) =>
                                    <CartItem key={index} item={item} increase={increase} decrease={decrease} remove={remove} />
                                )}
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={4} >
                        <Stack component={Card} sx={{ height: '100%', p: 2 }} direction="column" justifyContent="space-between" spacing={2} >
                            <Stack spacing={1}>
                                <Typography variant="h4" >Order summary</Typography>
                                <CurrencyExchange setAmount={setAmount} amount={amount} shippingCosts={shippingTotal} country={country} />
                            </Stack>
                            <Stack spacing={0.5}>
                                <Typography gutterBottom color="grayText" variant="caption">This is to your country of destination</Typography>
                                <ButtonGroup size="small">
                                    <CountryDropdown disabled={nzOnly} label={"Country"} id={"country"} value={country} onChange={(e: any) => setCountry(e.target.value)} />
                                    <LoadingButton size="small" sx={{ width: 200, ml: 1 }} disabled={!country} variant="outlined" loading={processing} onClick={handlePurchase}>Buy now</LoadingButton>
                                </ButtonGroup>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            }
        </Box>
    )
}

export default Cart;

type CartItemProps = {
    item: Items
    increase: Function;
    decrease: Function
    remove: Function
}

const CartItem = (props: CartItemProps) => {
    const { item, decrease, increase, remove } = props;
    const navigate = useNavigate();

    useEffect(() => {
        if (item.inStock !== true)
            remove(item.id)
    }, [item.inStock, remove, item.id])

    return (
        <Grid sx={{ my: 0.5, px: 1 }} spacing={2} container direction="row" justifyContent="space-between" alignItems="center" >
            <Grid onClick={() => navigate(`/shop/${item.slug}`)} component={ListItemButton}  >
                <Avatar sx={{ height: 55, width: 55 }} variant="square" alt={item.name} src={item.image.fields.file.url} />
                <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body1">${item.price}</Typography>
                </Box>
            </Grid>
            <Grid >
                <Stack direction="row" justifyContent={{ xs: 'space-between', sm: "flex-end" }} alignItems="center" spacing={4}>
                    <AmountButtons increase={() => increase(item.id)} remove={() => remove(item.id)} amount={item} decrease={() => decrease(item.id)} />
                    <Button startIcon={<CloseIcon fontSize="inherit" />} color="error" onClick={() => remove(item.id)} >
                        Remove
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    )
}

type AmountButtonsProps = {
    increase: () => void;
    decrease: () => void;
    remove: Function;
    amount: {
        amount: number[]
    }
}

const AmountButtons = (props: AmountButtonsProps) => {
    const { decrease, increase, amount, remove } = props;

    useEffect(() => {
        if (amount?.amount.length === undefined || amount?.amount.length === 0) {
            remove();
        }
    }, [amount?.amount.length, remove])

    return (
        <Stack direction="row" justifyContent="center" alignItems="center"    >
            <IconButton onClick={decrease} size="small">
                <RemoveIcon fontSize="inherit" />
            </IconButton>
            <Chip variant="outlined" label={amount?.amount.length} />
            <IconButton onClick={increase} size="small">
                <AddIcon fontSize="inherit" />
            </IconButton>
        </Stack>
    );
}
