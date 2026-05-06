import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewStepProps {
	rating: number;
	setRating: (val: number) => void;
	comment: string;
	setComment: (val: string) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ rating, setRating, comment, setComment }) => {
	return (
		<div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300'>
			<div className='space-y-3'>
				<Label className='text-neutral-400 font-bold uppercase text-[10px] tracking-widest'>Quality Rating</Label>
				<div className='flex gap-3 justify-center py-4 bg-neutral-800/20 rounded-2xl border border-neutral-800'>
					{[1, 2, 3, 4, 5].map((s) => (
						<button key={s} onClick={() => setRating(s)} className='focus:outline-hidden group relative transition-transform active:scale-95'>
							<Star
								className={cn(
									'h-10 w-10 transition-all duration-300',
									s <= rating ?
										'text-yellow-500 fill-yellow-500 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]'
									:	'text-neutral-700 hover:text-neutral-600',
								)}
							/>
							{s === rating && (
								<div className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-500 animate-ping' />
							)}
						</button>
					))}
				</div>
			</div>

			<div className='space-y-3'>
				<Label className='text-neutral-400 font-bold uppercase text-[10px] tracking-widest'>Review Comment</Label>
				<Textarea
					placeholder="Capture the customer's authentic experience here..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className='bg-neutral-800 border-neutral-700 min-h-[160px] resize-none focus:ring-1 focus:ring-blue-500/50 text-neutral-200 leading-relaxed'
				/>
				<p className='text-[10px] text-neutral-500 text-right font-medium italic'>{comment.length} characters</p>
			</div>
		</div>
	);
};
