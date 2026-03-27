import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Search, Loader2, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCustomersQuery, useCreateCustomerMutation } from '@/hooks/useCustomers';
import { useProductsQuery } from '@/hooks/useProducts';
import { useAddProductReviewMutation } from '@/hooks/useProductReviews';
import { useAuthStore } from '@/store/useAuthStore';
import { cn, getCloudFileURL } from '@/lib/utils';
import type { Customer } from '@/api/customers';
import type { Product } from '@/api/products';

interface AddReviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialProductId?: string;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
	open,
	onOpenChange,
	initialProductId,
}) => {
	const { user } = useAuthStore();
	const [step, setStep] = useState<'customer' | 'product' | 'review'>('customer');

	// Customer State
	const [customerSearch, setCustomerSearch] = useState('');
	const [debouncedCustomerSearch] = useDebounce(customerSearch, 500);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [isNewCustomer, setIsNewCustomer] = useState(false);
	const [newCustomer, setNewCustomer] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
	});

	// Product State
	const [productSearch, setProductSearch] = useState('');
	const [debouncedProductSearch] = useDebounce(productSearch, 500);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	// Review State
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');

	// Queries
	const { data: customersData, isLoading: isLoadingCustomers } = useCustomersQuery({
		search: debouncedCustomerSearch,
		limit: 5,
	});

	const { data: productsData, isLoading: isLoadingProducts } = useProductsQuery({
		businessId: user?.businessId || '',
		search: debouncedProductSearch,
		limit: 5,
	});

	const customers = customersData?.data?.results || [];
	const products = productsData?.data?.results || [];

	// Mutations
	const addReviewMutation = useAddProductReviewMutation(() => {
		onOpenChange(false);
		resetForm();
	});

	const createCustomerMutation = useCreateCustomerMutation((customer) => {
		submitReview(customer.id);
	});

	const resetForm = () => {
		setStep('customer');
		setSelectedCustomer(null);
		setIsNewCustomer(false);
		setNewCustomer({ firstName: '', lastName: '', email: '', phone: '' });
		setSelectedProduct(null);
		setRating(5);
		setComment('');
		setCustomerSearch('');
		setProductSearch('');
	};

	useEffect(() => {
		if (!open) resetForm();
	}, [open]);

	const submitReview = (customerId: string) => {
		const productId = initialProductId || selectedProduct?.id;
		if (!productId) return;

		addReviewMutation.mutate({
			productId,
			customerId,
			rating,
			comment,
			published: true,
		});
	};

	const handleFinalSubmit = () => {
		if (isNewCustomer) {
			createCustomerMutation.mutate({
				firstName: newCustomer.firstName,
				lastName: newCustomer.lastName,
				email: newCustomer.email,
				phone: { international: newCustomer.phone, national: '', uri: '' },
				gender: 'MALE'
			});
		} else if (selectedCustomer) {
			submitReview(selectedCustomer.id);
		}
	};

	const canGoNext = () => {
		if (step === 'customer') return isNewCustomer ? (newCustomer.firstName && newCustomer.email) : selectedCustomer;
		if (step === 'product') return initialProductId || selectedProduct;
		return true;
	};

	const nextStep = () => {
		if (step === 'customer') {
			if (initialProductId) setStep('review');
			else setStep('product');
		} else if (step === 'product') {
			setStep('review');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Star className="h-5 w-5 text-yellow-500" />
						Add Manual Review
					</DialogTitle>
				</DialogHeader>

				<div className="py-4 space-y-4">
					{step === 'customer' && (
						<div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
							<div className="flex items-center justify-between">
								<Label className="text-neutral-400">Customer Details</Label>
								<Button 
									variant="ghost" 
									size="sm" 
									className="text-xs h-7 text-blue-400"
									onClick={() => setIsNewCustomer(!isNewCustomer)}
								>
									{isNewCustomer ? 'Search Existing' : 'Add New Customer'}
								</Button>
							</div>

							{isNewCustomer ? (
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1">
										<Label className="text-xs text-neutral-500">First Name</Label>
										<Input 
											value={newCustomer.firstName}
											onChange={e => setNewCustomer({...newCustomer, firstName: e.target.value})}
											className="bg-neutral-800 border-neutral-700" 
										/>
									</div>
									<div className="space-y-1">
										<Label className="text-xs text-neutral-500">Last Name</Label>
										<Input 
											value={newCustomer.lastName}
											onChange={e => setNewCustomer({...newCustomer, lastName: e.target.value})}
											className="bg-neutral-800 border-neutral-700" 
										/>
									</div>
									<div className="col-span-2 space-y-1">
										<Label className="text-xs text-neutral-500">Email Address</Label>
										<Input 
											type="email"
											value={newCustomer.email}
											onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
											className="bg-neutral-800 border-neutral-700" 
										/>
									</div>
									<div className="col-span-2 space-y-1">
										<Label className="text-xs text-neutral-500">Phone (Optional)</Label>
										<Input 
											value={newCustomer.phone}
											onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
											className="bg-neutral-800 border-neutral-700" 
										/>
									</div>
								</div>
							) : (
								<div className="space-y-3">
									<div className="relative">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
										<Input 
											placeholder="Search by name or email..."
											value={customerSearch}
											onChange={e => setCustomerSearch(e.target.value)}
											className="pl-9 bg-neutral-800 border-neutral-700 h-10"
										/>
									</div>

									<div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
										{isLoadingCustomers ? (
											<div className="flex justify-center p-4">
												<Loader2 className="h-5 w-5 animate-spin text-neutral-600" />
											</div>
										) : customers.length > 0 ? (
											customers.map((c: Customer) => (
												<button
													key={c.id}
													onClick={() => setSelectedCustomer(c)}
													className={cn(
														"w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
														selectedCustomer?.id === c.id 
															? "bg-blue-500/10 border-blue-500/50" 
															: "bg-neutral-800/40 border-neutral-800 hover:border-neutral-700"
													)}
												>
													<div>
														<p className="font-medium text-sm text-white">{c.firstName} {c.lastName}</p>
														<p className="text-xs text-neutral-500">{c.email}</p>
													</div>
													{selectedCustomer?.id === c.id && <Check className="h-4 w-4 text-blue-400" />}
												</button>
											))
										) : customerSearch.length > 2 && (
											<p className="text-center py-4 text-sm text-neutral-500">No customers found.</p>
										)}
									</div>
								</div>
							)}
						</div>
					)}

					{step === 'product' && (
						<div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
							<Label className="text-neutral-400">Select Product</Label>
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
								<Input 
									placeholder="Search products..."
									value={productSearch}
									onChange={e => setProductSearch(e.target.value)}
									className="pl-9 bg-neutral-800 border-neutral-700 h-10"
								/>
							</div>

							<div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
								{isLoadingProducts ? (
									<div className="flex justify-center p-4">
										<Loader2 className="h-5 w-5 animate-spin text-neutral-600" />
									</div>
								) : products.length > 0 ? (
									products.map((p: Product) => (
										<button
											key={p.id}
											onClick={() => setSelectedProduct(p)}
											className={cn(
												"w-full text-left p-2 rounded-lg border transition-all flex items-center gap-3",
												selectedProduct?.id === p.id 
													? "bg-blue-500/10 border-blue-500/50" 
													: "bg-neutral-800/40 border-neutral-800 hover:border-neutral-700"
											)}
										>
											<div className="h-10 w-10 rounded bg-neutral-800 overflow-hidden shrink-0">
												{p.images?.[0] && <img src={getCloudFileURL(p.images[0].thumbnail)} className="w-full h-full object-cover" />}
											</div>
											<div className="overflow-hidden">
												<p className="font-medium text-sm text-white truncate">{p.title}</p>
												<p className="text-xs text-neutral-500">{p.id}</p>
											</div>
											{selectedProduct?.id === p.id && <Check className="h-4 w-4 text-blue-400 ml-auto shrink-0" />}
										</button>
									))
								) : productSearch.length > 2 && (
									<p className="text-center py-4 text-sm text-neutral-500">No products found.</p>
								)}
							</div>
						</div>
					)}

					{step === 'review' && (
						<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
							<div className="space-y-2">
								<Label className="text-neutral-400">Rating</Label>
								<div className="flex gap-2">
									{[1, 2, 3, 4, 5].map((s) => (
										<button
											key={s}
											onClick={() => setRating(s)}
											className="focus:outline-hidden group"
										>
											<Star 
												className={cn(
													"h-8 w-8 transition-all scale-100 group-hover:scale-110",
													s <= rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-700"
												)} 
											/>
										</button>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label className="text-neutral-400">Review Comment</Label>
								<Textarea 
									placeholder="Write the customer's review here..."
									value={comment}
									onChange={e => setComment(e.target.value)}
									className="bg-neutral-800 border-neutral-700 min-h-[120px] resize-none"
								/>
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="flex items-center justify-between border-t border-neutral-800 pt-4 gap-3">
					{step !== 'customer' && (
						<Button 
							variant="ghost" 
							onClick={() => setStep(step === 'review' && !initialProductId ? 'product' : 'customer')}
							className="text-neutral-400"
						>
							<ArrowLeft className="h-4 w-4 mr-2" /> Back
						</Button>
					)}
					<div className="flex-1" />
					{step === 'review' ? (
						<Button 
							onClick={handleFinalSubmit}
							disabled={!comment || addReviewMutation.isPending || createCustomerMutation.isPending}
							className="bg-blue-600 hover:bg-blue-500 min-w-[120px]"
						>
							{(addReviewMutation.isPending || createCustomerMutation.isPending) ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : 'Submit Review'}
						</Button>
					) : (
						<Button 
							onClick={nextStep}
							disabled={!canGoNext()}
							className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
						>
							Next <ArrowRight className="h-4 w-4 ml-2" />
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
