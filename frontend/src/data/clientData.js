// Sample client data for Alta Media client portal
export const clientData = {
  // Client Information
  client: {
    name: "John Smith",
    email: "john.smith@example.com",
    company: "Smith Enterprises",
    phone: "+63 912 345 6789",
    avatar: "https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=JS",
    joinDate: "2024-01-15"
  },

  // Active Package Information
  activePackage: {
    name: "META Marketing Package – Basic",
    price: "₱6,999",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    remainingBudget: 12500,
    totalBudget: 20000,
    projectManager: {
      name: "Sarah Johnson",
      email: "sarah.johnson@altamedia.com",
      phone: "+63 923 456 7890",
      avatar: "https://via.placeholder.com/150x150/10B981/FFFFFF?text=SJ"
    }
  },

  // Deliverables Data
  deliverables: [
    {
      id: 1,
      title: "Facebook Post Layout 1",
      type: "Graphic",
      status: "Approved",
      url: "#",
      thumbnail: "https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Facebook+Post+1",
      uploadedDate: "2024-01-20",
      approvedDate: "2024-01-22",
      fileSize: "2.3 MB",
      format: "PNG"
    },
    {
      id: 2,
      title: "Instagram Story Layout 2",
      type: "Graphic",
      status: "Pending Approval",
      url: "#",
      thumbnail: "https://via.placeholder.com/300x300/10B981/FFFFFF?text=Instagram+Story+2",
      uploadedDate: "2024-01-22",
      fileSize: "1.8 MB",
      format: "PNG"
    },
    {
      id: 3,
      title: "Product Reel 1",
      type: "Video",
      status: "Approved",
      url: "#",
      thumbnail: "https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Product+Reel+1",
      uploadedDate: "2024-01-25",
      approvedDate: "2024-01-27",
      fileSize: "15.2 MB",
      format: "MP4",
      duration: "30s"
    },
    {
      id: 4,
      title: "Facebook Ad Banner 1",
      type: "Graphic",
      status: "Approved",
      url: "#",
      thumbnail: "https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Ad+Banner+1",
      uploadedDate: "2024-01-28",
      approvedDate: "2024-01-30",
      fileSize: "3.1 MB",
      format: "PNG"
    },
    {
      id: 5,
      title: "Instagram Post Layout 3",
      type: "Graphic",
      status: "In Revision",
      url: "#",
      thumbnail: "https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Instagram+Post+3",
      uploadedDate: "2024-02-01",
      fileSize: "2.7 MB",
      format: "PNG",
      revisionNotes: "Please adjust the color scheme to match brand guidelines"
    },
    {
      id: 6,
      title: "Product Showcase Reel 2",
      type: "Video",
      status: "Pending Approval",
      url: "#",
      thumbnail: "https://via.placeholder.com/300x300/06B6D4/FFFFFF?text=Showcase+Reel+2",
      uploadedDate: "2024-02-03",
      fileSize: "18.5 MB",
      format: "MP4",
      duration: "30s"
    }
  ],

  // Analytics Data
  analytics: {
    weekly: {
      reach: 2300,
      engagement: 156,
      clicks: 89,
      conversions: 12,
      impressions: 4500,
      ctr: 3.1,
      cpc: 2.45
    },
    monthly: {
      reach: 8900,
      engagement: 567,
      clicks: 342,
      conversions: 45,
      impressions: 15600,
      ctr: 2.9,
      cpc: 2.67
    },
    campaigns: [
      {
        id: 1,
        name: "Brand Awareness Campaign",
        reach: 1500,
        impressions: 3200,
        clicks: 67,
        ctr: 3.1,
        conversions: 8,
        spend: 4500,
        status: "Active",
        startDate: "2024-01-20",
        endDate: "2024-02-20"
      },
      {
        id: 2,
        name: "Product Launch Campaign",
        reach: 800,
        impressions: 1300,
        clicks: 22,
        ctr: 2.8,
        conversions: 4,
        spend: 3000,
        status: "Active",
        startDate: "2024-01-25",
        endDate: "2024-02-25"
      },
      {
        id: 3,
        name: "Lead Generation Campaign",
        reach: 1200,
        impressions: 2100,
        clicks: 45,
        ctr: 3.5,
        conversions: 6,
        spend: 2800,
        status: "Paused",
        startDate: "2024-01-30",
        endDate: "2024-02-28"
      }
    ],
    adSets: [
      {
        id: 1,
        name: "Brand Awareness - Set 1",
        reach: 800,
        impressions: 1500,
        clicks: 25,
        ctr: 3.2,
        conversions: 3,
        spend: 2000,
        status: "Active"
      },
      {
        id: 2,
        name: "Brand Awareness - Set 2",
        reach: 700,
        impressions: 1700,
        clicks: 42,
        ctr: 3.0,
        conversions: 5,
        spend: 2500,
        status: "Active"
      },
      {
        id: 3,
        name: "Product Launch - Set 1",
        reach: 800,
        impressions: 1300,
        clicks: 22,
        ctr: 2.8,
        conversions: 4,
        spend: 3000,
        status: "Active"
      }
    ],
    ads: [
      {
        id: 1,
        name: "Brand Awareness Ad 1",
        reach: 400,
        impressions: 800,
        clicks: 12,
        ctr: 3.1,
        conversions: 2,
        spend: 1000,
        status: "Active"
      },
      {
        id: 2,
        name: "Brand Awareness Ad 2",
        reach: 400,
        impressions: 700,
        clicks: 13,
        ctr: 3.3,
        conversions: 1,
        spend: 1000,
        status: "Active"
      },
      {
        id: 3,
        name: "Product Launch Ad 1",
        reach: 300,
        impressions: 600,
        clicks: 8,
        ctr: 2.7,
        conversions: 2,
        spend: 1500,
        status: "Active"
      },
      {
        id: 4,
        name: "Product Launch Ad 2",
        reach: 500,
        impressions: 700,
        clicks: 14,
        ctr: 2.9,
        conversions: 2,
        spend: 1500,
        status: "Active"
      }
    ]
  },

  // Support and Communication
  support: {
    tickets: [
      {
        id: 1,
        title: "Request for additional revisions",
        description: "I would like to request additional revisions for the Instagram post layout",
        status: "Open",
        priority: "Medium",
        createdAt: "2024-02-01",
        updatedAt: "2024-02-02",
        assignedTo: "Sarah Johnson"
      },
      {
        id: 2,
        title: "Question about ad performance",
        description: "I have questions about the recent ad campaign performance",
        status: "Resolved",
        priority: "Low",
        createdAt: "2024-01-28",
        updatedAt: "2024-01-29",
        assignedTo: "Sarah Johnson"
      }
    ],
    chatHistory: [
      {
        id: 1,
        sender: "client",
        message: "Hi! I have a question about the latest graphics.",
        timestamp: "2024-02-05 10:30:00"
      },
      {
        id: 2,
        sender: "manager",
        message: "Hello John! I'm here to help. What would you like to know?",
        timestamp: "2024-02-05 10:32:00"
      },
      {
        id: 3,
        sender: "client",
        message: "When can I expect the next batch of deliverables?",
        timestamp: "2024-02-05 10:35:00"
      },
      {
        id: 4,
        sender: "manager",
        message: "We're working on the next set of graphics and should have them ready by Friday. I'll send them over as soon as they're complete!",
        timestamp: "2024-02-05 10:37:00"
      }
    ]
  },

  // Project Timeline
  timeline: [
    {
      id: 1,
      date: "2024-01-15",
      title: "Project Started",
      description: "META Marketing Package – Basic project initiated",
      type: "milestone"
    },
    {
      id: 2,
      date: "2024-01-20",
      title: "First Deliverables",
      description: "First batch of graphics delivered for review",
      type: "delivery"
    },
    {
      id: 3,
      date: "2024-01-22",
      title: "Graphics Approved",
      description: "Facebook Post Layout 1 approved by client",
      type: "approval"
    },
    {
      id: 4,
      date: "2024-01-25",
      title: "Video Content",
      description: "Product Reel 1 delivered for review",
      type: "delivery"
    },
    {
      id: 5,
      date: "2024-01-27",
      title: "Video Approved",
      description: "Product Reel 1 approved by client",
      type: "approval"
    },
    {
      id: 6,
      date: "2024-01-28",
      title: "Ad Campaigns Launched",
      description: "Brand Awareness and Product Launch campaigns activated",
      type: "milestone"
    },
    {
      id: 7,
      date: "2024-02-01",
      title: "Revision Request",
      description: "Client requested revisions for Instagram Post Layout 3",
      type: "revision"
    },
    {
      id: 8,
      date: "2024-02-03",
      title: "New Deliverables",
      description: "Product Showcase Reel 2 delivered for review",
      type: "delivery"
    }
  ],

  // Settings and Preferences
  settings: {
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    language: "English",
    timezone: "Asia/Manila",
    currency: "PHP"
  }
};

// Helper functions
export const getClientInfo = () => clientData.client;
export const getActivePackage = () => clientData.activePackage;
export const getDeliverables = () => clientData.deliverables;
export const getAnalytics = () => clientData.analytics;
export const getSupport = () => clientData.support;
export const getTimeline = () => clientData.timeline;
export const getSettings = () => clientData.settings;

// Filter functions
export const getDeliverablesByStatus = (status) => {
  return clientData.deliverables.filter(d => d.status === status);
};

export const getDeliverablesByType = (type) => {
  return clientData.deliverables.filter(d => d.type === type);
};

export const getActiveCampaigns = () => {
  return clientData.analytics.campaigns.filter(c => c.status === "Active");
};

export const getOpenTickets = () => {
  return clientData.support.tickets.filter(t => t.status === "Open");
};
