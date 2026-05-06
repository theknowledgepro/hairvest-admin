import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCreateCustomerMutation } from '@/hooks/useCustomers';
import { useAddProductReviewMutation } from '@/hooks/useProductReviews';
import { useAuthStore } from '@/store/useAuthStore';

// Step Components
import { CustomerStep } from './steps/CustomerStep';
import { ProductStep } from './steps/ProductStep';
import { ReviewStep } from './steps/ReviewStep';

import type { Customer } from '@/api/customers';
import type { Product } from '@/api/products';

interface AddReviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialProductId?: string;
}

type Step = 'customer' | 'product' | 'review';

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ open, onOpenChange, initialProductId }) => {
	const { user } = useAuthStore();
	const [step, setStep] = useState<Step>('customer');

	// Unified State
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [isNewCustomer, setIsNewCustomer] = useState(false);
	const [newCustomer, setNewCustomer] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
	});

	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');

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
				gender: 'MALE',
			});
		} else if (selectedCustomer) {
			submitReview(selectedCustomer.id);
		}
	};

	const canGoNext = () => {
		if (step === 'customer') return isNewCustomer ? newCustomer.firstName && newCustomer.email : selectedCustomer;
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

	const isPending = addReviewMutation.isPending || createCustomerMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='bg-neutral-950 border-neutral-800 text-white max-w-md p-0 overflow-hidden'>
				<DialogHeader className='px-6 pt-6 pb-4 border-b border-neutral-900 bg-neutral-900/50'>
					<DialogTitle className='flex items-center gap-2 text-xl'>
						<div className='p-2 rounded-lg bg-yellow-500/10'>
							<Star className='h-5 w-5 text-yellow-500 fill-yellow-500' />
						</div>
						Add Manual Review
					</DialogTitle>
				</DialogHeader>

				<div className='p-6'>
					{step === 'customer' && (
						<CustomerStep
							selectedCustomer={selectedCustomer}
							onSelect={setSelectedCustomer}
							isNewCustomer={isNewCustomer}
							setIsNewCustomer={setIsNewCustomer}
							newCustomer={newCustomer}
							setNewCustomer={setNewCustomer}
						/>
					)}

					{step === 'product' && (
						<ProductStep
							businessId={user?.businessId || ''}
							selectedProduct={selectedProduct}
							onSelect={setSelectedProduct}
						/>
					)}

					{step === 'review' && (
						<ReviewStep
							rating={rating}
							setRating={setRating}
							comment={comment}
							setComment={setComment}
						/>
					)}
				</div>

				<DialogFooter className='flex items-center justify-between p-6 border-t border-neutral-900 bg-neutral-900/20 gap-4'>
					{step !== 'customer' && (
						<Button
							variant='ghost'
							onClick={() => setStep(step === 'review' && !initialProductId ? 'product' : 'customer')}
							className='text-neutral-500 hover:text-white hover:bg-neutral-800'
						>
							<ArrowLeft className='h-4 w-4 mr-2' /> Back
						</Button>
					)}
					<div className='flex-1' />
					{step === 'review' ? (
						<Button
							onClick={handleFinalSubmit}
							disabled={!comment || isPending}
							className='bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
						>
							{isPending ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<>
									<CheckCircle2 className='h-4 w-4 mr-2' /> Submit Review
								</>
							)}
						</Button>
					) : (
						<Button
							onClick={nextStep}
							disabled={!canGoNext()}
							className='bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold px-8'
						>
							Next <ArrowRight className='h-4 w-4 ml-2' />
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
