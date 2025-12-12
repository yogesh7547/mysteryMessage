import * as React from 'react';
import { Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Tailwind,
  Hr, } from "@react-email/components";


interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function EmailTemplate({ username, otp }: VerificationEmailProps) {
  return (
   <Html lang="en" >
      <Head />
      <Preview>Your verification code is {otp}</Preview>
      <Tailwind>
        <Body className="bg-slate-100 font-sans my-auto mx-auto px-2">
          <Container className="bg-white border border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px] shadow-sm">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Verify your account
              </Heading>
              
              <Text className="text-black text-[14px] leading-[24px]">
                Hello <strong>{username}</strong>,
              </Text>
              
              <Text className="text-black text-[14px] leading-[24px]">
                Please use the following verification code to complete your registration:
              </Text>

              {/* --- OTP SECTION START --- */}
              <Section className="my-[32px] mx-auto bg-gray-100 rounded-md max-w-[280px]">
                <Text className="text-black text-[32px] font-bold tracking-[6px] leading-[40px] text-center my-[16px]">
                  {otp}
                </Text>
              </Section>
              {/* --- OTP SECTION END --- */}

              <Text className="text-black text-[14px] leading-[24px]">
                This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
              </Text>

              <Hr className="border-gray-200 my-[26px] mx-0 w-full" />

              <Text className="text-gray-500 text-[12px] leading-[24px]">
                Best regards,
                <br />
                The Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}