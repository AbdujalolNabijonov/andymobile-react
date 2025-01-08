import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import reduxLogger from "redux-logger"
import homePageReducer from './screens/HomePage/slice';
import brandPageReducer from './screens/BrandPage/slice';
import productPageReducer from './screens/ProductsPage/slice';
import blogPageReducer from './screens/BlogPage/slice';
import memberPageReducer from './screens/MyPageTemp/slice';
import orderPageReducer from './screens/TrackOrderPage/slice';


export const store = configureStore({
  //@ts-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(reduxLogger),
  reducer: {
    homePage: homePageReducer,
    brandPage: brandPageReducer,
    productPage: productPageReducer,
    blogPage: blogPageReducer,
    memberPage: memberPageReducer,
    orderPage:orderPageReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
