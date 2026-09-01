import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Square, Loader2, Camera as CameraIcon, MapPin, Search } from 'lucide-react';
import axios from 'axios';

// Global state to persist across unmounts for the demo
let globalAnalysisState = {
  file: null,
  fileName: '',
  fileSize: 0,
  cameraId: 'BOP-IND-NEP-001',
  detectionType: 'all',
  isUploading: false,
  isAnalyzing: false,
  uploadProgress: 0,
  analysisStatus: ''
};

const VideoAnalysis = () => {
  const [file, setFile] = useState(globalAnalysisState.file);
  const [cameraId, setCameraId] = useState(globalAnalysisState.cameraId);
  const [detectionType, setDetectionType] = useState(globalAnalysisState.detectionType);
  const [isUploading, setIsUploading] = useState(globalAnalysisState.isUploading);
  const [isAnalyzing, setIsAnalyzing] = useState(globalAnalysisState.isAnalyzing);
  const [uploadProgress, setUploadProgress] = useState(globalAnalysisState.uploadProgress);
  const [analysisStatus, setAnalysisStatus] = useState(globalAnalysisState.analysisStatus);
  const [evidenceImages, setEvidenceImages] = useState([]);
  const fileInputRef = useRef(null);

  // Sync state changes back to global state
  useEffect(() => {
    globalAnalysisState = {
      file,
      fileName: file ? file.name : '',
      fileSize: file ? file.size : 0,
      cameraId,
      detectionType,
      isUploading,
      isAnalyzing,
      uploadProgress,
      analysisStatus
    };
  }, [file, cameraId, detectionType, isUploading, isAnalyzing, uploadProgress, analysisStatus]);

  
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setEvidenceImages([]); // Clear previous evidence when a new file is selected
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    setEvidenceImages([]);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // 1. Upload Video
      setAnalysisStatus('Uploading video to processing node...');
      const uploadRes = await axios.post(`http://localhost:8000/videos/upload?camera_id=${cameraId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      const videoId = uploadRes.data.id;
      
      // 2. Start Analysis
      setIsUploading(false);
      setAnalysisStatus('Initiating YOLOv8 AI inference...');
      setUploadProgress(0); // Reset for analysis phase
      setIsAnalyzing(true);
      
      await axios.post(`http://localhost:8000/videos/${videoId}/analyze?detection_type=${detectionType}`);
      
      // Store videoId for evidence fetching
      globalAnalysisState.currentVideoId = videoId;
      
    } catch (error) {
      console.error('Error during analysis pipeline:', error);
      setAnalysisStatus('Error during processing. Check connection.');
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  // Handle the fake progress in a useEffect so it survives remounts/HMR
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(async () => {
        setUploadProgress(prev => {
          const next = prev + 5;
          if (next <= 100) {
            setAnalysisStatus(`Processing frame ${next * 12} / 1200... Detecting anomalies.`);
            return next;
          } else {
            clearInterval(interval);
            setIsAnalyzing(false);
            setAnalysisStatus('Analysis Complete. Events logged to Threat Stream.');
            
            // Fetch evidence images
            const vidId = globalAnalysisState.currentVideoId;
            if (vidId) {
              axios.get(`http://localhost:8000/videos/${vidId}/evidence`)
                .then(evRes => {
                  if (evRes.data && evRes.data.length > 0) {
                    setEvidenceImages(evRes.data);
                  }
                })
                .catch(err => console.error('Failed to fetch evidence', err));
            }
            return 100;
          }
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  return (
    <div className="p-8 max-w-5xl mx-auto relative z-10">
      <div className="mb-8 border-b border-primary/20 pb-4">
        <h1 className="text-3xl font-bold tracking-widest uppercase text-glow-primary text-primary">Intelligence Processing Unit</h1>
        <p className="text-primary/70 mt-2 font-mono tracking-widest text-xs uppercase">Upload drone or ground footage for autonomous threat detection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Upload & Config */}
        <div className="col-span-1 space-y-6">
          <div className="glass-panel p-6 space-y-5 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)]">
            <div>
              <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-2 font-mono">BOP Node</label>
              <div className="relative">
                <CameraIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                <select 
                  value={cameraId}
                  onChange={(e) => setCameraId(e.target.value)}
                  className="w-full bg-black/60 border border-primary/50 text-primary rounded-none pl-10 pr-4 py-3 focus:border-primary shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] outline-none transition-all appearance-none font-mono text-sm tracking-widest"
                >
                  <option value="BOP-IND-NEP-001">Sonauli Border Crossing</option>
                  <option value="BOP-IND-NEP-002">Raxaul Border</option>
                  <option value="BOP-IND-BTN-001">Jaigaon Checkpost</option>
                  <option value="BOP-IND-NEP-003">Banbasa Barrage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-2 font-mono">Analysis Vector</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                <select 
                  value={detectionType}
                  onChange={(e) => setDetectionType(e.target.value)}
                  className="w-full bg-black/60 border border-primary/50 text-primary rounded-none pl-10 pr-4 py-3 focus:border-primary shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] outline-none transition-all appearance-none font-mono text-sm tracking-widest"
                >
                  <option value="all">All Vectors (Smart Mode)</option>
                  <option value="intrusion">Perimeter Intrusion</option>
                  <option value="smuggling">Suspected Smuggling</option>
                  <option value="drone">Unidentified Drone</option>
                  <option value="vehicle">Unauthorized Vehicle</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={startAnalysis}
                disabled={!file || isUploading || isAnalyzing}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-none font-bold tracking-widest uppercase transition-all duration-300 font-mono text-xs ${
                  (!file || isUploading || isAnalyzing) 
                    ? 'bg-black/80 border border-primary/20 text-primary/30 cursor-not-allowed shadow-inner' 
                    : 'bg-primary/20 border border-primary text-primary shadow-neon-primary hover:bg-primary/30 hover:-translate-y-0.5'
                }`}
              >
                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                {isAnalyzing ? 'PROCESSING...' : isUploading ? 'UPLOADING UPLINK...' : 'INITIATE ANALYSIS'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Area & Preview */}
        <div className="col-span-2 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed p-12 text-center cursor-pointer transition-all bg-black/40 backdrop-blur-md relative overflow-hidden group scanline-overlay ${
              file ? 'border-primary shadow-[inset_0_0_20px_rgba(57,255,20,0.2)]' : 'border-primary/50 hover:border-primary hover:bg-black/60 shadow-[inset_0_0_10px_rgba(57,255,20,0.1)]'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="video/mp4,video/avi,video/quicktime" 
              className="hidden" 
            />
            
            <div className={`mx-auto w-16 h-16 mb-4 flex items-center justify-center border transition-all ${file ? 'border-primary bg-primary/20 text-primary shadow-neon-primary' : 'border-primary/50 bg-black text-primary/50 group-hover:border-primary group-hover:text-primary'}`}>
              <Upload size={28} />
            </div>
            <h3 className={`text-lg font-mono font-bold tracking-widest uppercase mb-1 ${file ? 'text-primary text-glow-primary' : 'text-primary/70'}`}>
              {file ? file.name : 'AWAITING FOOTAGE UPLINK'}
            </h3>
            <p className="text-xs font-mono tracking-widest text-primary/50 mt-2 uppercase">
              {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR EXTRACTION` : 'DRAG AND DROP OR CLICK TO SELECT DATA PACKET'}
            </p>
          </div>

          {(isUploading || isAnalyzing || analysisStatus) && (
            <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-primary tracking-widest uppercase text-glow-primary font-mono text-sm">PROCESSING UPLINK</h3>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-none border font-mono tracking-widest uppercase ${
                  isAnalyzing ? 'bg-warning/20 text-warning border-warning/50 shadow-neon-warning animate-pulse' : 
                  uploadProgress === 100 && !isAnalyzing ? 'bg-primary/20 text-primary border-primary/50 shadow-neon-primary' : 
                  'bg-primary/10 text-primary/70 border-primary/30'
                }`}>
                  {isAnalyzing ? 'INFERENCE ACTIVE' : uploadProgress === 100 && !isAnalyzing ? 'COMPLETED' : 'UPLOADING DATA'}
                </span>
              </div>
              
              <div className="mb-2 flex justify-between text-[10px] font-bold tracking-widest text-primary/70 font-mono uppercase">
                <span className={isAnalyzing ? 'animate-pulse' : ''}>{analysisStatus}</span>
                <span className="text-primary">{uploadProgress}%</span>
              </div>
              
              <div className="h-2 w-full bg-black border border-primary/30 shadow-[inset_0_0_5px_rgba(57,255,20,0.2)]">
                <div 
                  className={`h-full transition-all duration-300 ${isAnalyzing ? 'bg-warning shadow-neon-warning' : 'bg-primary shadow-neon-primary'}`}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Display Evidence Output */}
          {evidenceImages.length > 0 && !isAnalyzing && (
            <div className="mt-8">
              <h3 className="font-bold text-primary tracking-widest uppercase text-glow-primary font-mono text-lg mb-4 border-b border-primary/20 pb-2">Extracted Threat Intelligence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {evidenceImages.map((imgUrl, idx) => (
                  <div key={idx} className="border border-danger/50 bg-black/80 p-2 relative group scanline-overlay">
                    <img src={imgUrl} alt={`Evidence ${idx}`} className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 left-4 bg-danger/80 text-white text-[10px] font-bold px-2 py-1 uppercase font-mono tracking-widest">THREAT DETECTED</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysis;
