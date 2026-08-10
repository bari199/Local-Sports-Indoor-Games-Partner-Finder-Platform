import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  Loader2,
  Send,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  getReceivedRequests,
  getSentRequests,
  getMyPartners,
  updateRequestStatus,
} from "../../services/partnerRequestService";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received");

  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const [
        receivedResponse,
        sentResponse,
        partnersResponse,
      ] = await Promise.all([
        getReceivedRequests(),
        getSentRequests(),
        getMyPartners(),
      ]);

      if (receivedResponse.success) {
        setReceived(receivedResponse.requests || []);
      }

      if (sentResponse.success) {
        setSent(sentResponse.requests || []);
      }

      if (partnersResponse.success) {
        setPartners(partnersResponse.partners || []);
      }
    } catch (error) {
      console.error("Get requests error:", error);

      toast.error("Unable to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      setActionId(requestId);

      const response = await updateRequestStatus(
        requestId,
        status
      );

      if (!response.success) {
        toast.error(
          response.message || "Unable to update request"
        );
        return;
      }

      toast.success(
        status === "accepted"
          ? "Partner request accepted"
          : "Partner request rejected"
      );

      await fetchRequests();
    } catch (error) {
      console.error("Update request error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update request"
      );
    } finally {
      setActionId(null);
    }
  };

  const tabs = [
    {
      id: "received",
      label: "Received",
      icon: Clock3,
      count: received.length,
    },
    {
      id: "sent",
      label: "Sent",
      icon: Send,
      count: sent.length,
    },
    {
      id: "partners",
      label: "My Partners",
      icon: Users,
      count: partners.length,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900">
          Requests & Partners
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your partner requests and connections.
        </p>
      </div>

      {/* Tabs */}

      <div className="
        mb-6 flex overflow-x-auto
        rounded-xl border border-slate-200
        bg-white p-1
      ">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex min-w-fit flex-1
                items-center justify-center
                gap-2 rounded-lg
                px-4 py-2.5
                text-sm font-medium
                transition
                ${
                  active
                    ? "bg-[#0078BD] text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }
              `}
            >
              <Icon size={16} />

              {tab.label}

              <span
                className={`
                  rounded-full px-2 py-0.5 text-xs
                  ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading */}

      {loading && (
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={27}
              className="animate-spin text-[#0078BD]"
            />

            <p className="text-sm text-slate-500">
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* Received */}

      {!loading && activeTab === "received" && (
        <div className="space-y-4">
          {received.length > 0 ? (
            received.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="
                  rounded-2xl
                  border border-slate-200
                  bg-white p-5
                  shadow-sm
                "
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      overflow-hidden
                      rounded-full
                      bg-[#0078BD]/10
                      text-[#0078BD]
                    ">
                      {request.sender?.image ? (
                        <img
                          src={request.sender.image}
                          alt={request.sender.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={21} />
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {request.sender?.name}
                      </h3>

                      <p className="mt-0.5 text-sm text-slate-500">
                        wants to play{" "}
                        <span className="font-medium text-slate-700">
                          {request.game?.name}
                        </span>
                      </p>

                      {request.sender?.location && (
                        <p className="mt-1 text-xs text-slate-400">
                          {request.sender.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 sm:shrink-0">

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          request._id,
                          "accepted"
                        )
                      }
                      disabled={actionId === request._id}
                      className="
                        flex flex-1 items-center
                        justify-center gap-2
                        rounded-lg
                        bg-[#0078BD]
                        px-4 py-2.5
                        text-sm font-semibold
                        text-white
                        transition
                        hover:bg-[#0069A7]
                        disabled:opacity-60
                        sm:flex-none
                      "
                    >
                      {actionId === request._id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Check size={16} />
                      )}

                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          request._id,
                          "rejected"
                        )
                      }
                      disabled={actionId === request._id}
                      className="
                        flex flex-1 items-center
                        justify-center gap-2
                        rounded-lg
                        border border-slate-200
                        bg-white
                        px-4 py-2.5
                        text-sm font-semibold
                        text-slate-600
                        transition
                        hover:border-red-200
                        hover:bg-red-50
                        hover:text-red-600
                        disabled:opacity-60
                        sm:flex-none
                      "
                    >
                      <X size={16} />
                      Reject
                    </button>

                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState
              icon={Clock3}
              title="No pending requests"
              description="New partner requests will appear here."
            />
          )}
        </div>
      )}

      {/* Sent */}

      {!loading && activeTab === "sent" && (
        <div className="space-y-4">
          {sent.length > 0 ? (
            sent.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="
                  rounded-2xl
                  border border-slate-200
                  bg-white p-5
                "
              >
                <div className="flex items-center gap-4">

                  <div className="
                    flex h-12 w-12 shrink-0
                    items-center justify-center
                    overflow-hidden rounded-full
                    bg-slate-100
                    text-slate-400
                  ">
                    {request.receiver?.image ? (
                      <img
                        src={request.receiver.image}
                        alt={request.receiver.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={21} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {request.receiver?.name}
                    </h3>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Request for{" "}
                      <span className="font-medium text-slate-700">
                        {request.game?.name}
                      </span>
                    </p>
                  </div>

                  <div className="ml-auto shrink-0">
                    <span className="
                      rounded-full
                      bg-amber-50
                      px-3 py-1.5
                      text-xs font-semibold
                      text-amber-600
                    ">
                      Pending
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState
              icon={Send}
              title="No sent requests"
              description="Partner requests you send will appear here."
            />
          )}
        </div>
      )}

      {/* Partners */}

      {!loading && activeTab === "partners" && (
        <div>
          {partners.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.requestId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    shadow-sm
                  "
                >
                  <div className="p-5">

                    <div className="flex items-center gap-4">

                      <div className="
                        flex h-12 w-12
                        items-center justify-center
                        overflow-hidden
                        rounded-full
                        bg-[#0078BD]/10
                        text-[#0078BD]
                      ">
                        {partner.partner?.image ? (
                          <img
                            src={partner.partner.image}
                            alt={partner.partner.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound size={21} />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {partner.partner?.name}
                        </h3>

                        <p className="text-xs text-slate-400">
                          {partner.partner?.skillLevel ||
                            "Player"}
                        </p>
                      </div>
                    </div>

                    <div className="
                      mt-4 rounded-lg
                      bg-slate-50 p-3
                    ">
                      <p className="text-xs text-slate-400">
                        Connected through
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {partner.game?.name}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No partners yet"
              description="Accept a partner request to start building your connections."
            />
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="
      rounded-2xl
      border border-dashed
      border-slate-300
      bg-white
      px-6 py-14
      text-center
    ">
      <div className="
        mx-auto flex h-14 w-14
        items-center justify-center
        rounded-full
        bg-slate-100
        text-slate-400
      ">
        <Icon size={25} />
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
};

export default Requests;