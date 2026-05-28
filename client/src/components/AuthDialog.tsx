import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuthDialogContext } from "@/contexts/AuthDialogContext";
import { useRequestOTP, useVerifyOTP } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ArrowLeft, CheckCircle2, Wifi } from "lucide-react";

type Step = "email" | "otp" | "success";

export function AuthDialog() {
  const context = useAuthDialogContext();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const requestOTP = useRequestOTP();
  const verifyOTP = useVerifyOTP();

  const isOpen = context?.isOpen ?? false;
  const dialogType = context?.dialogType ?? null;
  const close = context?.close ?? (() => {});
  const openSignIn = context?.openSignIn ?? (() => {});
  const openSignUp = context?.openSignUp ?? (() => {});

  const resetForm = () => {
    setStep("email");
    setEmail("");
    setOtp("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    close();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await requestOTP.mutateAsync({ email });
      setStep("otp");
      toast({
        title: "Code sent!",
        description: "Check your email for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    }
  };

  const handleOTPSubmit = async (value: string) => {
    if (value.length !== 6) return;

    try {
      await verifyOTP.mutateAsync({ email, otp: value });
      setStep("success");
      toast({
        title: "Welcome!",
        description: "You have been signed in successfully.",
      });
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Invalid code",
        description: error.message || "Please check the code and try again",
        variant: "destructive",
      });
    }
  };

  if (!context) {
    return null;
  }

  const isSignUp = dialogType === "signup";
  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Sign up to start using Voltey"
    : "Sign in to your Voltey account";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-w-md max-h-screen sm:max-h-[90vh] overflow-y-auto p-0 sm:p-10 flex flex-col justify-center sm:justify-start bg-background border-none sm:border sm:rounded-3xl shadow-none sm:shadow-2xl">
        <div className="w-full h-full p-6 sm:p-0 flex flex-col">
          <DialogHeader className="text-center pb-2 flex-shrink-0">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center tracking-tight">
              {step === "success" ? "You're in!" : title}
            </DialogTitle>
            <DialogDescription className="text-center text-base sm:text-sm text-muted-foreground mt-2">
              {step === "success"
                ? "Successfully authenticated"
                : step === "otp"
                ? `Enter the 6-digit code sent to ${email}`
                : subtitle}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col justify-center sm:justify-start py-4 sm:py-0">
            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-6 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold ml-1">Email address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 sm:h-12 text-base sm:text-sm rounded-2xl sm:rounded-xl border-gray-200 focus:ring-primary/20"
                      required
                      data-testid="input-auth-email"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 sm:h-12 text-base sm:text-sm font-bold gradient-primary rounded-2xl sm:rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                  disabled={requestOTP.isPending}
                  data-testid="button-auth-continue"
                >
                  {requestOTP.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <div className="space-y-8 sm:space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      if (value.length === 6) {
                        handleOTPSubmit(value);
                      }
                    }}
                    disabled={verifyOTP.isPending}
                    data-testid="input-auth-otp"
                  >
                    <InputOTPGroup className="gap-1.5 min-[375px]:gap-2 sm:gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot 
                          key={i}
                          index={i} 
                          className="w-8 h-12 min-[360px]:w-9 min-[360px]:h-13 min-[390px]:w-10 min-[390px]:h-14 sm:w-10 sm:h-14 text-lg min-[360px]:text-xl sm:text-2xl font-bold rounded-xl sm:rounded-xl border-2 border-gray-100 focus:border-primary transition-all shadow-sm" 
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {verifyOTP.isPending && (
                  <div className="flex justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                )}

                <div className="flex flex-col items-center gap-6 sm:gap-3 text-base sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors py-3 px-6 rounded-full hover:bg-gray-50"
                    data-testid="button-auth-back"
                  >
                    <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4" />
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={requestOTP.isPending}
                    className="text-primary hover:text-primary-dark transition-colors font-bold p-3"
                    data-testid="button-auth-resend"
                  >
                    {requestOTP.isPending ? "Sending..." : "Resend code"}
                  </button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center py-12 sm:py-8">
                <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-full bg-accent/10 flex items-center justify-center mb-8 sm:mb-6 animate-in zoom-in-50 duration-300">
                  <CheckCircle2 className="h-12 w-12 sm:h-10 sm:w-10 text-accent" />
                </div>
                <p className="text-xl sm:text-base text-muted-foreground font-semibold">Redirecting you now...</p>
              </div>
            )}
          </div>

          {step === "email" && (
            <div className="text-center pt-8 sm:pt-6 border-t border-gray-100 flex-shrink-0">
              {isSignUp ? (
                <p className="text-base sm:text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={openSignIn}
                    className="text-primary hover:underline font-bold sm:font-semibold p-3"
                    data-testid="button-auth-switch-signin"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-base sm:text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={openSignUp}
                    className="text-primary hover:underline font-bold sm:font-semibold p-3"
                    data-testid="button-auth-switch-signup"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
