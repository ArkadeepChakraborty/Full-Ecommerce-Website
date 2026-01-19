import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'
import { GiStorkDelivery } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/admin',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'products',
		label: 'Products',
		path: '/admin/products',
		icon: <HiOutlineCube />
	},
	{
		key: 'orders',
		label: 'Orders',
		path: '/admin/orders',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'customers',
		label: 'Customers',
		path: '/admin/customers',
		icon: <HiOutlineUsers />
	},
	{
		key: 'transactions',
		label: 'Transactions',
		path: '/admin/transactions',
		icon: <HiOutlineDocumentText />
	},
	{
		key: 'deliveryboy',
		label: 'Delivery Boy',
		path: '/admin/deliveryboy',
		icon: <GiStorkDelivery />
	},
	{
		key: 'about',
		label: 'Content Change',
		path: '/admin/aboutadmin',
		icon: <FcAbout />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/admin/settings',
		icon: <HiOutlineCog />
	},
	// {
	// 	key: 'support',
	// 	label: 'Help & Support',
	// 	path: '/admin/support',
	// 	icon: <HiOutlineQuestionMarkCircle />
	// }
]
