import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../lib/schemas/auth.schemas';
import { useForgotPasswordMutation } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
    const [sent, setSent] = useState(false);
    const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormValues) => {
        forgotPassword(data.email, {
            onSuccess: () => setSent(true),
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6">
                <Link to="/auth/login" className="inline-flex items-center text-xs text-neutral-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="mr-1 h-3 w-3" /> Back to Login
                </Link>
                <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
                <p className="text-neutral-400 text-sm mt-1">Enter your email and we'll send you a reset link.</p>
            </div>

            {sent ? (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-sm text-center">
                    <p className="font-medium">Reset link sent successfully!</p>
                    <p className="mt-1 opacity-80">Check your email inbox to proceed.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@hairvest.com"
                            {...register('email')}
                            className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-400">{errors.email.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20"
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                    </Button>
                </form>
            )}
        </div>
    );
};
