import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import { RootState } from '../../../redux/store';
import { ViewRouteParamsType } from '../../../routes/AppRoutes';
import { Subscription } from "rxjs";
import callbackCreator from '../../../redux/fetchProductByIdCallback';

const ProductDetail = () => {

    const pid = Number((useParams() as ViewRouteParamsType).id)
    const navigate: NavigateFunction = useNavigate()

    const subscribedState = useSelector(
        (stateMap: RootState) => stateMap.singleProduct
    )
    const dispatch = useDispatch<any>()

    const { loading, errorMessage, product } = subscribedState
    useEffect(
        () => {
            const cancelTokenStatic = axios.CancelToken
            const sourceOfToken = cancelTokenStatic.source()
            const cancellationToken = sourceOfToken.token
            let subscription: Subscription | undefined;

            const callbackTobeDispatched = callbackCreator(pid, cancellationToken, subscription)
            subscription = dispatch(callbackTobeDispatched)

            return () => {
                console.log(cancellationToken);
                sourceOfToken.cancel('token cancelled')
                subscription?.unsubscribe()
            }
        },
        [pid]
    )

    let design: JSX.Element | null = null
    if (loading) {
        design = <div>Loading...</div>
    } else if (errorMessage !== '') {
        design = <div>{errorMessage}</div>
    } else if (product === null) {
        design = <span>No record</span>
    } else {
        design = (
            <>
                Detail of# {product.productName} with price:{product.price}
                <br />
                <button type='button' className='btn btn-primary'
                    onClick={
                        () => navigate('/products')
                    }>
                    Back to List
                </button>
            </>
        )
    }
    return design
}

export default ProductDetail