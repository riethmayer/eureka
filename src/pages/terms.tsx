import EurekaLogo from "@components/eureka-logo";

const TermsPage = () => {
  return (
    <div className="flex flex-col justify-center py-12 items-center">
      <EurekaLogo variant="large" />
      <main>
        <h1 className="text-5xl text-white mt-4">Terms of service</h1>
        <p className="text-white mt-4">Last udpated October 23, 2022</p>
        <h2 className="text-3xl text-white mt-4">1. Terms</h2>
      </main>
    </div>
  );
};

export default TermsPage;
