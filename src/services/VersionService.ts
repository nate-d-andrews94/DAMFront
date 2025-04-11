import { v4 as uuidv4 } from 'uuid';
import { AssetVersion, AssetActivity } from '@/types/asset.types';

// Mock data for version history
const mockVersions: Record<string, AssetVersion[]> = {
  '1': [
    {
      id: 'v1',
      assetId: '1',
      versionNumber: 1,
      fileUrl: '/mock/sample1_v1.jpg',
      thumbnailUrl: '/mock/sample1_thumb_v1.jpg',
      fileSize: 1024 * 1024 * 2.5, // 2.5MB
      createdAt: '2025-03-01T10:30:00Z',
      createdBy: 'John Doe',
      notes: 'Initial upload',
      isCurrentVersion: false
    },
    {
      id: 'v2',
      assetId: '1',
      versionNumber: 2,
      fileUrl: '/mock/sample1.jpg',
      thumbnailUrl: '/mock/sample1_thumb.jpg',
      fileSize: 1024 * 1024 * 2.8, // 2.8MB
      createdAt: '2025-03-15T14:20:00Z',
      createdBy: 'Jane Smith',
      notes: 'Updated with new branding colors',
      isCurrentVersion: true
    }
  ],
  '2': [
    {
      id: 'v3',
      assetId: '2',
      versionNumber: 1,
      fileUrl: '/mock/brochure_v1.pdf',
      fileSize: 1024 * 1024 * 3.0, // 3.0MB
      createdAt: '2025-02-10T14:20:00Z',
      createdBy: 'Marketing Team',
      notes: 'Initial version for review',
      isCurrentVersion: false
    },
    {
      id: 'v4',
      assetId: '2',
      versionNumber: 2,
      fileUrl: '/mock/brochure.pdf',
      thumbnailUrl: '/mock/brochure_thumb.jpg',
      fileSize: 1024 * 1024 * 3.2, // 3.2MB
      createdAt: '2025-03-10T14:20:00Z',
      createdBy: 'Product Team',
      notes: 'Updated with Q2 2025 product information',
      isCurrentVersion: true
    }
  ]
};

// Mock data for activity logs
const mockActivities: Record<string, AssetActivity[]> = {
  '1': [
    {
      id: 'a1',
      assetId: '1',
      action: 'view',
      timestamp: '2025-04-02T09:15:00Z',
      actorName: 'Marketing Team',
      versionNumber: 2
    },
    {
      id: 'a2',
      assetId: '1',
      action: 'download',
      timestamp: '2025-04-01T16:45:00Z',
      actorName: 'John Doe',
      versionNumber: 2
    },
    {
      id: 'a3',
      assetId: '1',
      action: 'version_upload',
      timestamp: '2025-03-15T14:20:00Z',
      actorName: 'Jane Smith',
      versionNumber: 2,
      contextData: {
        previousVersion: '1',
        changeDescription: 'Updated with new branding colors'
      }
    },
    {
      id: 'a4',
      assetId: '1',
      action: 'share',
      timestamp: '2025-03-10T11:30:00Z',
      actorName: 'Jane Smith',
      versionNumber: 1,
      contextData: {
        recipientEmail: 'client@example.com'
      }
    },
    {
      id: 'a5',
      assetId: '1',
      action: 'version_upload',
      timestamp: '2025-03-01T10:30:00Z',
      actorName: 'John Doe',
      versionNumber: 1,
      contextData: {
        changeDescription: 'Initial upload'
      }
    }
  ],
  '2': [
    {
      id: 'a6',
      assetId: '2',
      action: 'edit',
      timestamp: '2025-03-25T13:45:00Z',
      actorName: 'Content Manager',
      versionNumber: 2,
      contextData: {
        field: 'metadata.description',
        newValue: 'Product line brochure for Q2 2025'
      }
    },
    {
      id: 'a7',
      assetId: '2',
      action: 'download',
      timestamp: '2025-03-15T08:20:00Z',
      actorName: 'Sales Team',
      versionNumber: 2
    },
    {
      id: 'a8',
      assetId: '2',
      action: 'version_upload',
      timestamp: '2025-03-10T14:20:00Z',
      actorName: 'Product Team',
      versionNumber: 2,
      contextData: {
        previousVersion: '1',
        changeDescription: 'Updated with Q2 2025 product information'
      }
    },
    {
      id: 'a9',
      assetId: '2',
      action: 'version_upload',
      timestamp: '2025-02-10T14:20:00Z',
      actorName: 'Marketing Team',
      versionNumber: 1,
      contextData: {
        changeDescription: 'Initial version for review'
      }
    }
  ]
};

// Simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Service for handling asset version history and activity tracking
 */
class VersionService {
  /**
   * Get version history for a specific asset
   */
  static async getVersions(assetId: string): Promise<AssetVersion[]> {
    await delay(500);
    return mockVersions[assetId] || [];
  }

  /**
   * Get a specific version of an asset
   */
  static async getVersion(assetId: string, versionNumber: number): Promise<AssetVersion | null> {
    await delay(300);
    const versions = mockVersions[assetId] || [];
    return versions.find(v => v.versionNumber === versionNumber) || null;
  }

  /**
   * Upload a new version of an asset
   */
  static async uploadVersion(
    assetId: string, 
    file: File, 
    notes: string,
    generateThumbnail: boolean = true
  ): Promise<AssetVersion> {
    await delay(1000); // Simulate upload time
    
    const versions = mockVersions[assetId] || [];
    const nextVersionNumber = versions.length > 0 
      ? Math.max(...versions.map(v => v.versionNumber)) + 1 
      : 1;
    
    // Update previous versions to not be current
    if (versions.length > 0) {
      versions.forEach(v => v.isCurrentVersion = false);
    }
    
    // Create new version
    const newVersion: AssetVersion = {
      id: uuidv4(),
      assetId,
      versionNumber: nextVersionNumber,
      fileUrl: URL.createObjectURL(file),
      thumbnailUrl: generateThumbnail ? '/mock/generated_thumb.jpg' : undefined,
      fileSize: file.size,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User', // Would normally come from auth
      notes: notes,
      isCurrentVersion: true
    };
    
    // Add to mock data
    if (!mockVersions[assetId]) {
      mockVersions[assetId] = [];
    }
    mockVersions[assetId].push(newVersion);
    
    // Create activity log
    this.logActivity({
      id: uuidv4(),
      assetId,
      action: 'version_upload',
      timestamp: new Date().toISOString(),
      actorName: 'Current User',
      versionNumber: nextVersionNumber,
      contextData: {
        previousVersion: versions.length > 0 ? String(versions[versions.length - 1].versionNumber) : '',
        changeDescription: notes
      }
    });
    
    return newVersion;
  }

  /**
   * Restore a previous version of an asset to be the current version
   */
  static async restoreVersion(assetId: string, versionNumber: number): Promise<AssetVersion | null> {
    await delay(500);
    
    const versions = mockVersions[assetId] || [];
    const versionToRestore = versions.find(v => v.versionNumber === versionNumber);
    
    if (!versionToRestore) {
      return null;
    }
    
    // Update all versions to not be current
    versions.forEach(v => v.isCurrentVersion = false);
    
    // Mark restored version as current
    versionToRestore.isCurrentVersion = true;
    
    // Log activity
    this.logActivity({
      id: uuidv4(),
      assetId,
      action: 'version_restore',
      timestamp: new Date().toISOString(),
      actorName: 'Current User',
      versionNumber: versionNumber,
      contextData: {
        restoredFrom: String(versionNumber)
      }
    });
    
    return versionToRestore;
  }

  /**
   * Get activity log for a specific asset
   */
  static async getActivities(assetId: string): Promise<AssetActivity[]> {
    await delay(500);
    // Return activities sorted by timestamp (newest first)
    return (mockActivities[assetId] || []).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Log a new activity
   */
  static async logActivity(activity: AssetActivity): Promise<AssetActivity> {
    await delay(200);
    
    if (!mockActivities[activity.assetId]) {
      mockActivities[activity.assetId] = [];
    }
    
    mockActivities[activity.assetId].push(activity);
    
    return activity;
  }

  /**
   * Log a view activity
   */
  static async logView(assetId: string, versionNumber: number = 1): Promise<void> {
    const activity: AssetActivity = {
      id: uuidv4(),
      assetId,
      action: 'view',
      timestamp: new Date().toISOString(),
      actorName: 'Current User',
      versionNumber
    };
    
    await this.logActivity(activity);
  }

  /**
   * Log a download activity
   */
  static async logDownload(assetId: string, versionNumber: number = 1): Promise<void> {
    const activity: AssetActivity = {
      id: uuidv4(),
      assetId,
      action: 'download',
      timestamp: new Date().toISOString(),
      actorName: 'Current User',
      versionNumber
    };
    
    await this.logActivity(activity);
  }

  /**
   * Log a share activity
   */
  static async logShare(assetId: string, sharedLinkId: string, recipientEmail?: string): Promise<void> {
    const activity: AssetActivity = {
      id: uuidv4(),
      assetId,
      action: 'share',
      timestamp: new Date().toISOString(),
      actorName: 'Current User',
      sharedLinkId,
      contextData: recipientEmail ? { recipientEmail } : undefined
    };
    
    await this.logActivity(activity);
  }

  /**
   * Log an edit activity
   */
  static async logEdit(assetId: string, field: string, newValue: string): Promise<void> {
    const activity: AssetActivity = {
      id: uuidv4(),
      assetId,
      action: 'edit',
      timestamp: new Date().toISOString(),
      actorName: 'Current User',
      contextData: {
        field,
        newValue
      }
    };
    
    await this.logActivity(activity);
  }
}

export default VersionService;