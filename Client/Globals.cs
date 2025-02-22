namespace FileFlows.Client
{
    public class Globals
    {
        public static string Version = "0.1.0.100";
        public static bool Demo { get; set; } = false;

        public static string LIST_OPTION_GROUP = "###GROUP###";


        private static string _lblName;
        public static string lblName
        {
            get
            {
                if (_lblName == null)
                    _lblName = Translater.Instant("Labels.Name");
                return _lblName;
            }
        }
        private static string _lblEnabled;
        public static string lblEnabled
        {
            get
            {
                if (_lblEnabled == null)
                    _lblEnabled = Translater.Instant("Labels.Enabled");
                return _lblEnabled;
            }
        }
    }
}
